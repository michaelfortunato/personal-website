import Layout from "@/components/Blog/layout";
import {
  deserializePost,
  serializePost,
  type PostMetadata,
  type SerializedPost,
} from "@/lib/posts";
import {
  buildPost,
  listPostIds,
  postPathFromId,
} from "@/lib/server-only/posts";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { computeGithubCommitURL } from "@/lib/buildInfo";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ClockIcon, CommitIcon, TextIcon } from "@radix-ui/react-icons";
import { NextPageWithLayout } from "pages/_app";
import { blogBodyFont } from "@/lib/fonts";
import { happenedSameDay } from "@/lib/utils";
import { ParsedUrlQuery } from "querystring";

function formatHeaderTimestamp(timestamp: Date): string {
  return timestamp.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatModifiedTimestamp(timestamp: Date): string {
  return timestamp.toLocaleString("en-US", {
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

function Header(metadata: PostMetadata) {
  const createdTimestamp = metadata.buildInfo.firstCommit.timestamp;
  const modifiedTimestamp = metadata.buildInfo.currentCommit.timestamp;
  const createdDateTimeValue = createdTimestamp.toISOString();
  const modifiedDateTimeValue = modifiedTimestamp.toISOString();

  const isEditedOnDifferentDay = !happenedSameDay(
    createdTimestamp,
    modifiedTimestamp,
  );

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

function Footer(metadata: PostMetadata) {
  const timestamp = metadata.buildInfo.currentCommit.timestamp;
  const commitHash = metadata.buildInfo.currentCommit.commitHash;
  const hasValidCommitHash = /^[a-f0-9]{40}$/i.test(commitHash);
  const commitUrl = hasValidCommitHash
    ? computeGithubCommitURL("personal-website", commitHash)
    : null;
  const tagLine = metadata.tags
    .map((value) => <div>`#${value}`</div>)
    .join(" ");

  return (
    <div className="not-prose flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="text-sm text-muted-foreground">Thanks for reading.</div>
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
            <span className="flex flex-col">
              {metadata.tags.map((value) => (
                <div>#{value}</div>
              ))}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}

interface GetStaticPathsResult extends ParsedUrlQuery {
  id: string[];
}
type GetStaticPropsResult = { post: SerializedPost };

const Page: NextPageWithLayout<GetStaticPropsResult> = ({
  post: serializedPost,
}) => {
  const post = deserializePost(serializedPost);
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

export const getStaticPaths: GetStaticPaths<
  GetStaticPathsResult
> = async () => {
  const ids = await listPostIds();
  const paths = ids.map((id) => ({ params: { id: id.split("/") } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  GetStaticPropsResult,
  GetStaticPathsResult
> = async ({ params }) => {
  // TODO: Fetch necessary data
  const id_list = params?.id;
  if (!id_list) return { notFound: true };

  const id = id_list.join("/");
  const inputFilepath = await postPathFromId(id);
  const postData = await buildPost(inputFilepath);
  const post = serializePost(postData);

  return { props: { post } };
};

export default Page;
