import RootPageLayout from "@/components/RootPageLayout";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import { type Metadata } from "@/lib/posts";
import { BuildInfo } from "@/lib/buildInfo";
import { getBuildInfo } from "@/lib/server-only/buildInfo";

function formatTimestamp(timestamp: string) {
  const asNumber = Number(timestamp);
  if (!Number.isNaN(asNumber) && asNumber >= -8.64e12 && asNumber <= +8.64e12) {
    return new Date(asNumber * 1000).toLocaleDateString();
  }
  const asDate = new Date(timestamp);
  if (!Number.isNaN(asDate.valueOf())) {
    return asDate.toLocaleDateString();
  }
  return timestamp;
}

function FeaturedPost(post: Metadata) {
  return (
    <div className="rounded bg-card p-4 shadow">
      <Link
        className="text-lg font-semibold underline"
        href={`/blog/${post.id}`}
      >
        {post.title}
      </Link>
      <div className="mt-2 text-sm text-muted-foreground">
        {formatTimestamp(post.createdTimestamp)}
      </div>
    </div>
  );
}

function FeaturedPosts({ posts }: { posts: Metadata[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {posts.map((post) => (
        <FeaturedPost key={post.id} {...post} />
      ))}
    </div>
  );
}

type PageProps = {
  posts: Metadata[];
  buildInfo: BuildInfo;
};

function getFeaturedPosts(allPosts: Metadata[]) {
  return allPosts.filter((_post) => true);
}

const Page: NextPageWithLayout<PageProps> = ({ posts }) => {
  const postList = getFeaturedPosts(posts); // TODO: Decide which posts to feature
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <FeaturedPosts posts={[...postList]} />
    </div>
  );
};

Page.getLayout = (page) => {
  return (
    <RootPageLayout buildInfo={page.props.buildInfo}>{page}</RootPageLayout>
  );
};

export async function getStaticProps() {
  const allPostsData = await getAllPostsMetadata();
  return {
    props: { posts: allPostsData, buildInfo: await getBuildInfo() },
  };
}

export default Page;
