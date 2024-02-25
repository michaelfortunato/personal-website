import { RootPageTheme } from "pages/_app";
import { getAllPosts, Post } from "../../lib/posts";

export const BlogPageTheme: RootPageTheme = {
	name: "Blog",
	theme: null,
	previewColor: "#14213D",
	previewTextColor: "#e6af4b",
	transition: { backgroundColor: "#14213D" }
};

export async function getStaticProps() {
	const allPostsData = await getAllPosts();
	return {
		props: { posts: allPostsData }
	};
}

function FeaturedPost(post: Post) {
	return <div className="shadow p-4 bg-white rounded">{post.id}</div>;
}

function FeaturedPosts({ posts }: { posts: Post[] }) {
	return (
		<div className="grid grid-cols-2 gap-4">
			{posts.map(post => (
				<FeaturedPost key={post.id} {...post} />
			))}
		</div>
	);
}

function getFeaturedPosts(allPosts: Post[]) {
	return allPosts.filter(_post => true);
}

export default function Blog({ posts }: { posts: Post[] }) {
	const featuredPosts = getFeaturedPosts(posts); // TODO: Decide which posts to feature
	return (
		<div className="flex flex-col justify-center items-center min-h-screen">
			<FeaturedPosts posts={...featuredPosts} />
		</div>
	);
}
