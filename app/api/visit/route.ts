import TelemetryService from "@/lib/telemetryService";
import unwrap from "@/lib/utils";
import { VisitorSQLRepository as VisitorRepository } from "@/lib/visitorRepository";
import { PageSQLRepository as PageRepository } from "@/lib/pageRepository";
import { PageVisitSQLRepository as PageVisitRepository } from "@/lib/pageVisitRepository";
import { getPGClient as getClient } from "@/lib/persistence";

/// Record a new visit to the site
export async function POST(request: Request) {
  const dbClientRes = await getClient();
  if (dbClientRes.isErr()) {
    return Response.json({ res: dbClientRes.toString() });
  }
  const dbClient = dbClientRes.value;

  const service = new TelemetryService(
    dbClient,
    new VisitorRepository(),
    new PageRepository(),
    new PageVisitRepository(),
  );
  const reqBody = await request.json();
  const visitor_ip = unwrap(reqBody.visitor_ip);
  const page_url = unwrap(reqBody.page_url);
  const visited_at = new Date(unwrap(reqBody.visited_at));
  const result = await service.recordVisit(page_url, visitor_ip, visited_at);
  if (result.isErr()) {
    const error = result.error;
    return Response.json({ error: error.message }, { status: 404 });
  }
  return Response.json({ res: reqBody });
}
