import Layout from "@/components/Blog/layout";
import { useBlogSettings } from "@/components/Blog/settings";
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
import { computeGithubCommitURL, dateToPrettyString } from "@/lib/buildInfo";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { NextPageWithLayout } from "pages/_app";
import { blogBodyFont } from "@/lib/fonts";
import { happenedSameDay } from "@/lib/utils";
import { ParsedUrlQuery } from "querystring";
import { GitCommit } from "lucide-react";

function formatHeaderTimestamp(timestamp: Date): string {
  return timestamp.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
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
      <Separator className="mt-5 bg-slate-900" />
    </div>
  );
}
function Footer(metadata: PostMetadata) {
  const {
    settings: { showCommitInformation },
  } = useBlogSettings();
  const commitHash = metadata.buildInfo.currentCommit.commitHash;
  const commitURL = computeGithubCommitURL("personal-website", commitHash);
  const hasTags = metadata.tags.length > 0;

  return (
    <div className="not-prose flex flex-col gap-1">
      <div className="flex justify-center">
        <div className="text-sm text-muted-foreground">Thanks for reading.</div>
      </div>
      {showCommitInformation ? (
        // NOTE: items-baseline keeps tag stack aligned with metadata text.
        <div className="flex flex-wrap items-baseline md:flex-nowrap justify-center gap-1 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1 hover:underline">
            <Link href={commitURL}>
              {dateToPrettyString(metadata.modifiedTimestamp)}
            </Link>
          </div>
          <span aria-hidden="true">·</span>
          <div className="max-w-[22ch] hover:underline truncate inline-flex items-center gap-1">
            <Link href={commitURL}>
              {metadata.buildInfo.currentCommit.message}
            </Link>
          </div>
          <span aria-hidden="true">·</span>
          <div className="hover:underline">
            <Link about="View Commit" href={commitURL}>
              <GitCommit className="inline" width="15px" strokeWidth={1} />
              {metadata.buildInfo.currentCommit.shortCommitHash}
            </Link>
          </div>
          <span aria-hidden="true">·</span>
          <div className="inline-flex flex-col">
            {metadata.tags.map((value) => (
              <div key={value}>{value}</div>
            ))}
          </div>
        </div>
      ) : null}
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
  // NOTE: Maybe document why prose mx-auto fixes the sizing on mobile
  // (content respects tailwind container class further up the stack)
  // and why its preferable to having a single dedicated flex item in
  // justify-center.
  return (
    <div
      className={`${blogBodyFont.className} prose mx-auto dark:prose-invert prose-h1:my-0`}
    >
      <div className="flex flex-col gap-4 ">
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
                  alt="Me apple picking in 2021."
                />
                <p className="text-sm text-muted-foreground">
                  Me apple picking in 2021.
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator className="bg-slate-900" />
        <Footer {...post.metadata} />
      </div>
    </div>
  );
};

Page.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths: GetStaticPaths<
  GetStaticPathsResult
> = async () => {
  const ids =
    process.env.NODE_ENV != "development"
      ? await listPostIds()
      : ["_test", ...(await listPostIds())];
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
