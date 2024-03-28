import RootPageLayout from "@/components/RootPageLayout";
import { HardHat } from "lucide-react";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import { getAllPosts, PostFrontMatter } from "../../lib/posts";

export async function getStaticProps() {
	const allPostsData = await getAllPosts();
	return {
		props: { posts: allPostsData }
	};
}

function FeaturedPost(post: PostFrontMatter) {
	return (<div className="shadow p-4 bg-white rounded">
    <Link href={`blog/posts/${post.id}`}>{post.id}</Link></div>);
}

function FeaturedPosts({ posts }: { posts: PostFrontMatter[] }) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{posts.map(post => (
				<FeaturedPost key={post.id} {...post} />
			))}
		</div>
	);
}

type PageProps = {
	posts: PostFrontMatter[];
};

function getFeaturedPosts(allPosts: PostFrontMatter[]) {
	return allPosts.filter(_post => true);
}

const Page: NextPageWithLayout<PageProps> = ({ posts }) => {
	const featuredPosts = getFeaturedPosts(posts); // TODO: Decide which posts to feature
	return (
  <div>
		<div className="flex flex-col justify-center items-center min-h-screen">
			<FeaturedPosts posts={...featuredPosts} />
		</div>
    <div className="absolute w-full bottom-0 right-0 text-white">
    <div className="flex flex-col justify-center items-center">
    <div className="flex flex-col p-8">
      <div className="flex flex-col items-center gap-8">
      <HardHat className="h-20 w-20"/ >
      </div>
      <div className="text-xl">
      3/2024: This page (and, admittedly, website in general) is currently under construction.
      I appreciate your patience!
      </div>
    </div>
    </div>
    </div>

  </div>
	);
};

Page.getLayout = page => {
	return <RootPageLayout>{page}</RootPageLayout>;
};

export default Page;
