import Layout from "@/components/Blog/layout";
import { type Metadata, type Post } from "@/lib/posts";
import {
  buildPost,
  listPostIds,
  postPathFromId,
} from "@/lib/server-only/posts";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { computeGithubCommitURL } from "@/lib/buildInfo";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ClockIcon, CommitIcon, TextIcon } from "@radix-ui/react-icons";
import { NextPageWithLayout } from "pages/_app";
import { blogBodyFont } from "@/lib/fonts";

function parseTimestamp(timestamp: string): Date | null {
  const asNumber = Number(timestamp);
  if (!Number.isNaN(asNumber) && asNumber >= -8.64e12 && asNumber <= +8.64e12) {
    return new Date(asNumber * 1000);
  }

  const asDate = new Date(timestamp);
  if (!Number.isNaN(asDate.valueOf())) {
    return asDate;
  }

  return null;
}

function formatHeaderTimestamp(timestamp: string): string {
  const parsedDate = parseTimestamp(timestamp);
  if (!parsedDate) return timestamp;

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function unixDay(timestamp: string): number | null {
  const seconds = Number(timestamp);
  if (Number.isNaN(seconds)) return null;
  return Math.floor(seconds / 86400);
}

function formatModifiedTimestamp(timestamp: string): string {
  const parsedDate = parseTimestamp(timestamp);
  if (!parsedDate) return timestamp;

  return parsedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
    timeZone: "America/Chicago",
  });
}

function Header(metadata: Metadata) {
  const createdTimestamp = metadata.buildInfo.firstCommit.timestamp;
  const modifiedTimestamp = metadata.buildInfo.currentCommit.timestamp;
  const createdDateTimeValue = parseTimestamp(createdTimestamp)?.toISOString();
  const modifiedDateTimeValue =
    parseTimestamp(modifiedTimestamp)?.toISOString();
  const createdDayKey = unixDay(createdTimestamp);
  const modifiedDayKey = unixDay(modifiedTimestamp);
  const isEditedOnDifferentDay =
    createdDayKey !== null &&
    modifiedDayKey !== null &&
    createdDayKey !== modifiedDayKey;

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="min-w-0 leading-tight">{metadata.title}</h1>
      <time
        className="not-prose mt-3 text-sm font-medium leading-5 text-foreground/70"
        dateTime={createdDateTimeValue}
      >
        {formatHeaderTimestamp(createdTimestamp)}
      </time>
      {isEditedOnDifferentDay ? (
        <div className="not-prose text-xs leading-5 text-foreground/60">
          Revised on{" "}
          <time dateTime={modifiedDateTimeValue}>
            {formatHeaderTimestamp(modifiedTimestamp)}
          </time>
        </div>
      ) : null}
      <Separator className="mt-5" />
    </div>
  );
}

function Footer(metadata: Metadata) {
  const timestamp = metadata.buildInfo.currentCommit.timestamp;
  const commitHash = metadata.buildInfo.currentCommit.commitHash;
  const hasValidCommitHash = /^[a-f0-9]{40}$/i.test(commitHash);
  const commitUrl = hasValidCommitHash
    ? computeGithubCommitURL("personal-website", commitHash)
    : null;
  const tagLine = metadata.tags.map((value) => `#${value}`).join(" ");

  return (
    <div className="not-prose flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Thanks for reading.
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground md:flex-nowrap">
        <div className="inline-flex items-center gap-1">
          <CommitIcon />
          {commitUrl ? (
            <Link
              href={commitUrl}
              className="underline-offset-2 hover:underline"
            >
              {metadata.buildInfo.currentCommit.shortCommitHash}
            </Link>
          ) : (
            <span>{metadata.buildInfo.currentCommit.shortCommitHash}</span>
          )}
        </div>
        <span aria-hidden="true">·</span>
        <div className="inline-flex items-center gap-1">
          <TextIcon />
          {commitUrl ? (
            <Link
              href={commitUrl}
              className="max-w-[22ch] truncate underline-offset-2 hover:underline md:max-w-[40ch]"
            >
              {metadata.buildInfo.currentCommit.message}
            </Link>
          ) : (
            <span
              className="max-w-[22ch] truncate md:max-w-[40ch]"
              title={metadata.buildInfo.currentCommit.message}
            >
              {metadata.buildInfo.currentCommit.message}
            </span>
          )}
        </div>
        <span aria-hidden="true">·</span>
        <div className="inline-flex items-center gap-1">
          <ClockIcon />
          {commitUrl ? (
            <Link
              className="underline-offset-2 hover:underline"
              href={commitUrl}
            >
              {formatModifiedTimestamp(timestamp)}
            </Link>
          ) : (
            <span>{formatModifiedTimestamp(timestamp)}</span>
          )}
        </div>
        {tagLine ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{tagLine}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

type PageProps = {
  // posts: Metadata[];
  post: Post;
};

const Page: NextPageWithLayout<PageProps> = ({ post }) => {
  return (
    <Layout>
      <div className="flex h-full justify-center">
        <div
          className={`${blogBodyFont.className} prose flex flex-col gap-4 dark:prose-invert prose-h1:my-0`}
        // className={`prose flex flex-col gap-4 dark:prose-invert`}
        >
          <Header {...post.metadata} />
          <div
            // className={`${blogBodyFont.className}`}
            className="typst-content"
            dangerouslySetInnerHTML={{ __html: post.content.body }}
          ></div>
          <div className="not-prose flex justify-end">
            <div className="inline-flex items-center gap-2 text-sm text-foreground/75">
              <span>- Michael</span>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="cursor-pointer rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-label="Open profile photo"
                  >
                    <Image
                      className="h-5 w-5 rounded-sm object-cover opacity-90"
                      src="/blog/Avatar.jpeg"
                      width={40}
                      height={40}
                      alt="Michael Fortunato"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <Image
                    className="h-auto w-full rounded-sm object-cover"
                    src="/blog/Avatar.jpeg"
                    width={1024}
                    height={1024}
                    alt="Me apple picking, circa 2021"
                  />
                  <p className="text-sm text-muted-foreground">
                    Me apple picking, circa 2021.
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Separator />
          <Footer {...post.metadata} />
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  // TODO: Return a list of the values for id
  const ids = await listPostIds();
  const paths = ids.map((id) => ({ params: { id: id.split("/") } }));
  return { paths, fallback: false };
}

type StaticParams = { params: { id: string[] } };

export async function getStaticProps({ params: { id: id_list } }: StaticParams) {
  // TODO: Fetch necessary data
  const id = id_list.join("/")
  const inputFilepath = await postPathFromId(id);
  const postData = await buildPost(inputFilepath);
  const post = JSON.parse(JSON.stringify(postData)) as Post;

  return { props: { post } };
}

export default Page;
