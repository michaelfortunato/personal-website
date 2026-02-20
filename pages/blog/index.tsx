import Link from "next/link";
import { GetStaticProps } from "next";
import { NextPageWithLayout } from "pages/_app";
import {
  deserializePostMetadata,
  type PostMetadata,
  serializePostMetadata,
  type SerializedPostMetadata,
} from "@/lib/posts";
import { listPosts } from "@/lib/server-only/posts";
import Layout from "@/components/Blog/layout";
import { PropsWithChildren } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BuildStamp from "@/components/BuildStamp";
import { BuildInfo } from "@/lib/buildInfo";
import { getBuildInfo } from "@/lib/server-only/buildInfo";

function sortByMostRecent(posts: PostMetadata[]): PostMetadata[] {
  return [...posts].sort((left, right) => {
    const leftTime = left.modifiedTimestamp.getTime() ?? 0;
    const rightTime = right.modifiedTimestamp.getTime() ?? 0;
    return rightTime - leftTime;
  });
}

export function filterByTag(
  posts: PostMetadata[],
  tag: string,
): PostMetadata[] {
  const needle = tag.toLowerCase();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === needle),
  );
}

export function filterByNonTag(
  posts: PostMetadata[],
  tag: string,
): PostMetadata[] {
  const needle = tag.toLowerCase();
  return posts.filter((post) =>
    post.tags.every((t) => t.toLowerCase() !== needle),
  );
}

function Stack({
  posts,
  title,
  supplement,
}: PropsWithChildren<{
  posts: PostMetadata[];
  title: string;
  supplement: string;
}>) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8 px-6 pb-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{supplement}</p>
      </header>

      <div className="space-y-4">
        {posts.map((post) => {
          const updatedDateTime = post.modifiedTimestamp.toISOString();
          return (
            <Card key={post.id} className="flex justify-between p-5">
              <div className="gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <Link
                  className="text-lg font-medium leading-tight hover:underline"
                  href={`/blog/${post.id}`}
                >
                  {post.title}
                </Link>
                {post.tags.length > 0 ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {post.tags.map((tag) => `${tag}`).join(", ")}
                  </p>
                ) : null}
              </div>
              <div>
                <div className="flex flex-col">
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={updatedDateTime}
                  >
                    {post.createdTimestamp.getTime() ==
                    post.modifiedTimestamp.getTime()
                      ? "Published"
                      : "Revised"}{" "}
                    on{" "}
                    {post.modifiedTimestamp.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <div>
                    <span>
                      {post.buildInfo.isDirty ? (
                        <Badge variant={"destructive"}>Is Dirty</Badge>
                      ) : null}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function LatestWritings({
  posts,
}: PropsWithChildren<{ posts: PostMetadata[] }>) {
  const sortedPosts = filterByNonTag(sortByMostRecent(posts), "daily");
  return (
    <Stack
      posts={sortedPosts}
      title={"Latest Writings"}
      supplement={"All of my writing, sorted by most recently revised"}
    />
  );
}

function ShortNotes({ posts }: PropsWithChildren<{ posts: PostMetadata[] }>) {
  const sortedPosts = filterByTag(sortByMostRecent(posts), "daily");
  if (sortedPosts.length === 0) {
    return null;
  }
  return (
    <Stack
      posts={sortedPosts}
      title={"Short Notes"}
      supplement={"Daily notes and scrap posts"}
    />
  );
}

type PageProps = {
  posts: SerializedPostMetadata[];
  websiteWideBuildInfo: BuildInfo;
};

const Page: NextPageWithLayout<PageProps> = ({ posts: serializedPosts }) => {
  const posts = serializedPosts.map(deserializePostMetadata);
  return (
    <div>
      <div className="flex flex-col items-center">
        <LatestWritings posts={posts} />
        <ShortNotes posts={posts} />
      </div>
    </div>
  );
};

Page.getLayout = (page) => {
  return (
    <>
      <Layout>{page}</Layout>
      <div className="absolute bottom-0 left-0 w-full">
        <BuildStamp buildInfo={page.props.websiteWideBuildInfo} />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const postsWithMetadata = await listPosts();
  const websiteWideBuildInfo = await getBuildInfo();

  return {
    props: {
      posts: postsWithMetadata.map(serializePostMetadata),
      websiteWideBuildInfo,
    },
  };
};

export default Page;
