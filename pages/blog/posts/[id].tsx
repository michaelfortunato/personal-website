import Layout from "../../../components/layout";
import {
  getAllPostIds,
  getPostData,
  PostData,
  PostFrontMatter,
} from "lib/posts";

function Header(frontMatter: PostFrontMatter) {
  return (
    <div>
      <h1 className="text-xl">{frontMatter.title}</h1>
      <br />
      <i>Created on</i>: {frontMatter.createdTimestamp}
    </div>
  );
}

function Footer() {
  return (
    <div>
      <div className="flex"></div>
    </div>
  );
}

export default function Post({ postData }: { postData: PostData }) {
  return (
    <Layout>
      <div className="flex h-full justify-center bg-white">
        <div className="prose flex flex-col gap-4">
          <Header {...postData.frontMatter} />
          <div
            dangerouslySetInnerHTML={{ __html: postData.renderedContent }}
          ></div>
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
