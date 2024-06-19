import PageRepository from "@/lib/pageRepository";
import TelemetryService from "@/lib/telemetryService";
import unwrap from "@/lib/utils";
import VisitorRepository from "@/lib/visitorRepository";
import getClient from "@/lib/persistence";
import $try from "@/lib/macros";

/// Record a new visit to the site
export async function POST(request: Request) {
  const dbClientRes = $try!(await getClient());
  const dbClient = dbClientRes;

  const visitorRepo = new VisitorRepository();
  const pageRepo = new PageRepository();
  const service = new TelemetryService<typeof dbClient>(
    dbClient,
    visitorRepo,
    pageRepo,
  );
  const reqBody = await request.json();
  const visitor_ip = unwrap(reqBody.visitor_ip);
  const page_url = unwrap(reqBody.page_url);
  const visited_at = new Date();
  visited_at.setTime(unwrap(reqBody.visited_at));
  await service.recordVisit(page_url, visitor_ip, visited_at);
  return Response.json({ res: reqBody });
}
