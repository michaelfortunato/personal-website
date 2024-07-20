import { None, Ok, Option, Result, Some } from "ts-results-es";

export default class Post {
  public readonly id: string;
  public author_id: string;
  public title: string;
  public draft: boolean;
  public content: Option<string>;
  public tags: string[];
  constructor(
    id: string,
    author_id: string,
    title: string,
    draft: boolean,
    content: Option<string>,
    tags: string[],
  ) {
    this.id = id;
    this.author_id = author_id;
    this.title = title;
    this.draft = draft;
    this.content = content;
    this.tags = tags;
  }
  publish(): Result<null, Error> {
    this.draft = false;
    return Ok(null);
  }
  unpublish(): Result<null, Error> {
    this.draft = false;
    return Ok(null);
  }
}
