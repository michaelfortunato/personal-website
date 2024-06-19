import { Ok, Result } from "ts-results-es";
import Page from "./page";
import Repository from "./repository";
import Visitor from "./visitor";
import { Context } from "./persistence";
import { tryAsync } from "./utils";

enum Reaction {
  Disliked = -1,
  Neutral,
  Liked,
}

export default class TelemetryService<P extends Context> {
  private readonly ctx: P;
  private readonly visitorRepo: Repository<Visitor, P>;
  private readonly pageRepo: Repository<Page, P>;
  constructor(
    db: P,
    visitorRepo: Repository<Visitor, P>,
    pageRepo: Repository<Page, P>,
  ) {
    this.ctx = db;
    this.visitorRepo = visitorRepo;
    this.pageRepo = pageRepo;
  }

  async recordVisit(
    pageUrl: string,
    visitorIP: string,
    unixTimestamp: Date,
  ): Promise<Result<null, Error>> {
    const startRC = tryAsync(() => this.ctx.start());

    const existsResult = await this.visitorRepo.exists(visitorIP, this.ctx);
    if (existsResult.isErr()) {
      return existsResult;
    }
    const exists = existsResult.unwrap();
    if (!exists) {
      const visitor = { ip: visitorIP };
      const createResult = await this.visitorRepo.insert(visitor, this.ctx);
      if (createResult.isErr()) {
        return createResult;
      }
    }
    const commitRC = tryAsync(() => this.ctx.commit());
    return Ok(null);
  }

  async recordReaction(
    pageUrl: string,
    visitiorIP: string,
    reaction: Reaction,
  ): Promise<Result<null, string>> {
    throw new Error("Method not implemented.");
  }
}
