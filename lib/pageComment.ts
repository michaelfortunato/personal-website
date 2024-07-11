import { None, Option, Result, Some } from "ts-results-es";

export default class PageComment {
  public readonly id: string;
  public visitorIp: string;
  public pageUrl: string;
  public text: Option<string>;
  constructor(
    id: string,
    visitorIp: string,
    pageUrl: string,
    content: Option<string>,
  ) {
    this.id = id;
    this.visitorIp = visitorIp;
    this.pageUrl = pageUrl;
    this.text = content;
  }
  public set setComment(comment: string) {
    this.text = Some(comment);
  }
}
