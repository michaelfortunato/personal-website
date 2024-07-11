import { Mutable } from "./utils";

export enum Reaction {
  Disliked = -1,
  Neutral,
  Liked,
}

export default class PageVisit {
  public page_url: string;
  public visitor_ip: string;
  public first_visited: Date;
  public last_visited: Date;
  public number_of_visits: number;
  public reaction: Reaction;
  constructor(
    pageUrl: string,
    visitorIp: string,
    firstVisited: Date,
    lastVisited: Date,
    numberOfVisits: number,
  ) {
    this.page_url = pageUrl;
    this.visitor_ip = visitorIp;
    this.first_visited = firstVisited;
    this.last_visited = lastVisited;
    this.number_of_visits = numberOfVisits;
    this.reaction = Reaction.Neutral;
  }
  updateLastVisited(visitedAt: Date) {
    if ((visitedAt.getTime() - this.last_visited.getTime()) / 1000 / 3600 > 8) {
      this.number_of_visits += 1;
    }
    this.last_visited = visitedAt;
  }
  updateReaction(reaction: Reaction) {
    this.reaction = reaction;
  }
}

/// NOTE: Fun with Rust
function updateLastVisited2(
  self: Mutable<PageVisit>,
  visitedAt: Date,
): PageVisit {
  self.last_visited = visitedAt;
  self.number_of_visits += 1;
  return self;
}
