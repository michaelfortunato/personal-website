import RootPageLayout from "@/components/RootPageLayout";
import { HardHat } from "lucide-react";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import { type Metadata } from "@/lib/posts";
import { getAllPosts } from "@/lib/server-only/posts";
import { BuildInfo } from "@/lib/buildInfo";
import { getBuildInfo } from "@/lib/server-only/buildInfo";


function FeaturedPost(post: Metadata) {
	return (<div className="shadow p-4 bg-card rounded">
    <Link href={`blog/${post.id}`}>{post.id}</Link></div>);
}

function FeaturedPosts({ posts }: { posts: Metadata[] }) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{posts.map(post => (
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
    </div>
    </div>

  </div>
	);
};

Page.getLayout = page => {
	return <RootPageLayout buildInfo={page.props.buildInfo}>{page}</RootPageLayout>;
};

export async function getStaticProps() {
	const allPostsData = await getAllPosts();
	return {
    props: { posts: allPostsData, buildInfo: await getBuildInfo() }
	};
}

export default Page;
