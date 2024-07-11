import Link from "next/link";
import { type Metadata } from "@/lib/posts";
import { getAllPosts } from "@/lib/server-only/posts";
import { BuildInfo } from "@/lib/buildInfo";

function FeaturedPost(post: Metadata) {
  return (
    <div className="rounded bg-card p-4 shadow">
      <Link href={`blog/${post.id}`}>{post.id}</Link>
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

export default async function Page() {
  const posts = await getAllPosts();
  const postList = getFeaturedPosts(posts); // TODO: Decide which posts to feature
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <FeaturedPosts posts={[...postList]} />
      </div>
      <div className="absolute bottom-0 right-0 w-full text-white">
        <div className="flex flex-col items-center justify-center"></div>
      </div>
    </div>
  );
}
