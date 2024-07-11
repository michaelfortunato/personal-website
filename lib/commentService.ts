import { Err, Ok, Result } from "ts-results-es";
import { Context } from "./persistence";
import { PageRepository } from "./pageRepository";
import PageComment from "./pageComment";
import VisitorRepository from "./visitorRepository";
import { PageCommentRepository } from "./pageCommentRepository";

export default class CommentService<P extends Context> {
  private readonly ctx: P;
  private readonly visitorRepo: VisitorRepository<P>;
  private readonly pageRepo: PageRepository<P>;
  private readonly pageCommentRepo: PageCommentRepository<P>;
  constructor(
    db: P,
    visitorRepo: VisitorRepository<P>,
    pageRepo: PageRepository<P>,
    pageCommentRepo: PageCommentRepository<P>,
  ) {
    this.ctx = db;
    this.visitorRepo = visitorRepo;
    this.pageRepo = pageRepo;
    this.pageCommentRepo = pageCommentRepo;
  }
  async addComment(
    userId: string, // This is the visitorIp if the user is anonymous idk
    pageUrl: string,
    text: string,
  ): Promise<Result<PageComment, Error>> {
    const startRC = await this.ctx.start();
    if (startRC.isErr()) return startRC;
    try {
      // TODO: If the user is anonymous, they are a visitor
      const userExists = await this.visitorRepo.exists(userId, this.ctx);
      if (userExists.isErr()) {
        throw userExists;
      }
      if (!userExists.value) {
        throw new Error(`User/visitor with id ${userId} does not exist`);
      }

      const pageExists = await this.pageRepo.exists(pageUrl, this.ctx);
      if (pageExists.isErr()) {
        throw pageExists;
      }
      if (!pageExists.value) {
        throw new Error(`User/visitor with id ${userId} does not exist`);
      }
      const pageComment = (
        await this.pageCommentRepo.insert(userId, pageUrl, text, this.ctx)
      ).unwrap();
      (await this.ctx.commit()).unwrap();
      return Ok(pageComment);
    } catch (e) {
      console.error((e as Error).message);
      return Err(new Error((e as Error).message));
    }
  }
}
