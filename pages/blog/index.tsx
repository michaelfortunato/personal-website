import RootPageLayout from "@/components/RootPageLayout";
import { NextPageWithLayout } from "pages/_app";
import { getAllPosts, PostFrontMatter } from "../../lib/posts";

export async function getStaticProps() {
	const allPostsData = await getAllPosts();
	return {
		props: { posts: allPostsData }
	};
}

function FeaturedPost(post: PostFrontMatter) {
	return <div className="shadow p-4 bg-white rounded">{post.id}</div>;
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
		<div className="flex flex-col justify-center items-center min-h-screen">
			<FeaturedPosts posts={...featuredPosts} />
		</div>
	);
};

Page.getLayout = page => {
	return <RootPageLayout>{page}</RootPageLayout>;
};

export default Page;
