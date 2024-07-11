import unwrap from "@/lib/utils";
import { VisitorSQLRepository as VisitorRepository } from "@/lib/visitorRepository";
import { PageSQLRepository as PageRepository } from "@/lib/pageRepository";
import { getPGClient as getClient } from "@/lib/persistence";
import CommentService from "@/lib/commentService";
import { PageCommentSQLRepository as PageCommentRepository } from "@/lib/pageCommentRepository";
import { NextRequest } from "next/server";

type CreateCommentReqBody = { user_id: string; page_id: string; text: string };

/// Record a new visit to the site
export async function POST(request: NextRequest) {
  const dbClientRes = await getClient();
  if (dbClientRes.isErr()) {
    return Response.json({ res: dbClientRes.toString() });
  }
  const dbClient = dbClientRes.value;

  const service = new CommentService(
    dbClient,
    new VisitorRepository(),
    new PageRepository(),
    new PageCommentRepository(),
  );
  const reqBody: CreateCommentReqBody = await request.json();
  const userId = reqBody.user_id || unwrap(request.ip);
  const pageId = unwrap(reqBody.page_id);
  const text = unwrap(reqBody.text);
  const result = await service.addComment(userId, pageId, text);
  if (result.isErr()) {
    const error = result.error;
    return Response.json({ message: error.message }, { status: 404 });
  }
  return Response.json({ res: reqBody });
}
