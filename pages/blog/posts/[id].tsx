import Layout from "../../../components/layout";
import {
	getAllPostIds,
	getPostData,
	PostData,
	PostFrontMatter
} from "lib/posts";

function Header(frontMatter: PostFrontMatter) {
	return (
		<div>
			<h1>{frontMatter.title}</h1>
			<br />
			<i>Created on</i>: {frontMatter.createdTimestamp}
		</div>
	);
}

function Footer() {
	return (
		<div>
			<p className="prose-2xl font-extrabold">Further Reading</p>
			<div className="flex">
				<div className="flex-1">h</div>
				<div className="flex-1">h</div>
			</div>
		</div>
	);
}

export default function Post({ postData }: { postData: PostData }) {
	return (
		<Layout>
			<div className="bg-white h-full flex justify-center">
				<div className="flex flex-col gap-4 prose">
					<Header {...postData.frontMatter} />
					<hr />
					<div
						dangerouslySetInnerHTML={{ __html: postData.renderedContent }}
					></div>
					<hr />
					<Footer />
				</div>
			</div>
		</Layout>
	);
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
