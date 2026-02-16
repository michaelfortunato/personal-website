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

function LatestWritings({ posts }: PropsWithChildren<{ posts: Metadata[] }>) {
  const sortedPosts = filterByNonTag(sortByMostRecent(posts), "daily");
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Latest Writings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          All entries, sorted by last date of revision.
        </p>
      </header>

      <div className="space-y-4">
        {sortedPosts.map((post) => {
          const updatedDateTime = parseTimestamp(
            post.modifiedTimestamp,
          )?.toISOString();
          const publishedDateTime = parseTimestamp(
            post.createdTimestamp,
          )?.toISOString();

          return (
            <article
              key={post.id}
              className="rounded-lg border border-border/70 bg-card/40 p-5"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <Link
                  className="text-lg font-medium leading-tight hover:underline"
                  href={`/blog/${post.id}`}
                >
                  {post.title}
                </Link>
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={updatedDateTime}
                >
                  Revised on {formatTimestamp(post.modifiedTimestamp)}
                </time>
              </div>

              <time
                className="mt-2 block text-xs text-muted-foreground"
                dateTime={publishedDateTime}
              >
                Published {formatTimestamp(post.createdTimestamp)}
              </time>
              {post.tags.length > 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  {post.tags.map((tag) => `#${tag}`).join(" ")}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ShortNotes({ posts }: PropsWithChildren<{ posts: Metadata[] }>) {
  const sortedPosts = filterByTag(sortByMostRecent(posts), "daily");
  if (sortedPosts.length == 0) {
    return null;
  }
  return (
    <header>
      <h1 className="text-3xl font-semibold">Musings</h1>
      {sortedPosts.map((post) => {
        return <p>TODO</p>;
      })}
    </header>
  );
}

type PageProps = {
  posts: Metadata[];
};

const Page: NextPageWithLayout<PageProps> = ({ posts }) => {
  return (
    <>
      <LatestWritings posts={posts} />
      <ShortNotes posts={posts} />
    </>
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
