import { Err, Ok, Result, Some } from "ts-results-es";
import { Context } from "./persistence";
import unwrap, { tryAsync } from "./utils";
import PageVisitRepository from "./pageVisitRepository";
import PageVisit, { Reaction } from "./pageVisit";
import { PageRepository } from "./pageRepository";
import VisitorRepository from "./visitorRepository";

export default class TelemetryService<P extends Context> {
  private readonly ctx: P;
  private readonly visitorRepo: VisitorRepository<P>; // TODO: turn Repository<Visitor> into VisitorRepository
  private readonly pageRepo: PageRepository<P>;
  private readonly pageVisitRepo: PageVisitRepository<P>;
  constructor(
    ctx: P,
    visitorRepo: VisitorRepository<P>,
    pageRepo: PageRepository<P>,
    pageVisitRepo: PageVisitRepository<P>,
  ) {
    this.ctx = ctx;
    this.visitorRepo = visitorRepo;
    this.pageRepo = pageRepo;
    this.pageVisitRepo = pageVisitRepo;
  }

  async recordVisit(
    pageUrl: string,
    visitorIp: string,
    unixTimestamp: Date,
  ): Promise<Result<PageVisit, Error>> {
    try {
      const startRC = await tryAsync(() => this.ctx.start());
      if (startRC.isErr()) {
        return startRC;
      }
      const exists = (
        await this.visitorRepo.exists(visitorIp, this.ctx)
      ).unwrap();
      if (!exists) {
        const visitor = { ip: visitorIp };
        (await this.visitorRepo.insert(visitor, this.ctx)).unwrap();
        const pageVisit = new PageVisit(
          pageUrl,
          visitorIp,
          unixTimestamp,
          unixTimestamp,
          1,
        );
        (await this.pageVisitRepo.insert(pageVisit, this.ctx)).unwrap();
        await this.ctx.commit();
        return Ok(pageVisit);
      } else {
        let pageVisitOption = (
          await this.pageVisitRepo.get(pageUrl, visitorIp, this.ctx)
        ).unwrap();
        let pageVisit;

        if (pageVisitOption.isNone()) {
          const newPageVisit = new PageVisit(
            pageUrl,
            visitorIp,
            unixTimestamp,
            unixTimestamp,
            1,
          );
          const insertPageVisitResult = await this.pageVisitRepo.insert(
            newPageVisit,
            this.ctx,
          );
          pageVisit = insertPageVisitResult.unwrap();
        } else {
          pageVisit = pageVisitOption.value;
        }
        pageVisit.updateLastVisited(unixTimestamp);
        console.log("HERE");
        console.log(pageVisit);
        (await this.pageVisitRepo.update(pageVisit, this.ctx)).unwrap();
        (await this.ctx.commit()).unwrap();
        return Ok(pageVisit);
      }
    } catch (e) {
      const rollbackRC = await tryAsync(() => this.ctx.rollback());
      if (rollbackRC.isErr()) {
        // TODO: how do we handle this critical error?
        // Log it maybe??
        return rollbackRC;
      }
      return Err(e as Error);
    }
  }

  async recordReaction(
    pageUrl: string,
    visitorIP: string,
    reaction: Reaction,
  ): Promise<Result<PageVisit, Error>> {
    try {
      await this.ctx.start();
      const pageVisitOption = (
        await this.pageVisitRepo.get(pageUrl, visitorIP, this.ctx)
      ).unwrap();
      if (pageVisitOption.isNone()) {
        return Err(
          new Error(
            `User with ip ${visitorIP} tried to react to a page ${pageUrl}, but the visit has yet to be recorded` +
              `. This a server error on mnf's end I am sorry about that.`,
          ),
        );
      }
      let pageVisit = pageVisitOption.value;
      pageVisit.updateReaction(reaction);
      (await this.pageVisitRepo.update(pageVisit, this.ctx)).unwrap();
      (await this.ctx.commit()).unwrap();
      return Ok(pageVisit);
    } catch (e) {
      const rollbackRC = await tryAsync(() => this.ctx.rollback());
      if (rollbackRC.isErr()) {
        // TODO: how do we handle this critical error?
        // Log it maybe??
        return rollbackRC;
      }
      return Err(e as Error);
    }
  }
}
