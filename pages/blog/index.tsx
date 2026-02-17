import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import { Metadata } from "@/lib/posts";
import {
  _typstFileToMetadata,
  getCommitInfoForFileOrFallback,
  listPostFiles,
  listPosts,
} from "@/lib/server-only/posts";
import Layout from "@/components/Blog/layout";
import { PropsWithChildren } from "react";
import { Card } from "@/components/ui/card";

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

function formatTimestamp(timestamp: string): string {
  const parsedDate = parseTimestamp(timestamp);
  if (!parsedDate) return timestamp;

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sortByMostRecent(posts: Metadata[]): Metadata[] {
  return [...posts].sort((left, right) => {
    const leftTime = parseTimestamp(left.modifiedTimestamp)?.getTime() ?? 0;
    const rightTime = parseTimestamp(right.modifiedTimestamp)?.getTime() ?? 0;
    return rightTime - leftTime;
  });
}

export function filterByTag(posts: Metadata[], tag: string): Metadata[] {
  const needle = tag.toLowerCase();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() === needle),
  );
}

export function filterByNonTag(posts: Metadata[], tag: string): Metadata[] {
  const needle = tag.toLowerCase();
  return posts.filter((post) =>
    post.tags.some((t) => t.toLowerCase() !== needle),
  );
}

function Stack({ posts, title, supplement }: PropsWithChildren<{ posts: Metadata[], title: string, supplement: string }>) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-8 px-6 pb-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {supplement}
        </p>
      </header>

      <div className="space-y-4">
        {posts.map((post) => {
          const updatedDateTime = parseTimestamp(
            post.modifiedTimestamp,
          )?.toISOString();
          const publishedDateTime = parseTimestamp(
            post.createdTimestamp,
          )?.toISOString();
          return (<Card key={post.id} className="flex justify-between p-5">
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
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={updatedDateTime}
                >
                {post.createdTimestamp == post.modifiedTimestamp ? "Published" : "Revised"} on {formatTimestamp(post.modifiedTimestamp)}
                </time>
            </div>
          </Card>);
        })}
      </div>
    </div>)
}

function LatestWritings({ posts }: PropsWithChildren<{ posts: Metadata[] }>) {
  const sortedPosts = filterByNonTag(sortByMostRecent(posts), "daily");
  return (<Stack posts={sortedPosts} title={"Latest Writings"} supplement={"All of my writing, sorted by most recently revised"} />);
}

function ShortNotes({ posts }: PropsWithChildren<{ posts: Metadata[] }>) {
  const sortedPosts = filterByTag(sortByMostRecent(posts), "daily");
  if (sortedPosts.length === 0) {
    return null;
  }
  return (<Stack posts={sortedPosts} title={"Short Notes"} supplement={"Daily notes and scrap posts"} />);
}

type PageProps = {
  posts: Metadata[];
};

const Page: NextPageWithLayout<PageProps> = ({ posts }) => {
  return (
    <div className="flex flex-col items-center">
      <LatestWritings posts={posts} />
      <ShortNotes posts={posts} />
    </div>
  );
};

Page.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export async function getStaticProps() {
  const postsWithMetadata = await listPosts();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(postsWithMetadata)) as Metadata[],
    },
  };
}

export default Page;
