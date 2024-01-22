import Layout from "@components/layout";
import { getAllPostIds, getPostData, PostData } from "lib/posts";

export default function Post({ postData }: { postData: PostData }) {
	return (
		<Layout>
			{postData.title}
			<br />
			{postData.id}
			<br />
			{postData.date}
		</Layout>
	);
	// TODO: Render a post
}

export async function getStaticPaths() {
	// TODO: Return a list of the values for id
	const paths = await getAllPostIds();
	return { paths, fallback: false };
}

type Params = { params: { id: string } };

export async function getStaticProps({ params }: Params) {
	// TODO: Fetch necessary data
	const postData = await getPostData(params.id);
	return { props: { postData } };
}
