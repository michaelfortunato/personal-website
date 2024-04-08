import Layout from "@/components/Blog/layout";
import { getAllPostIds, getPostData, Post, Metadata } from "lib/posts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function Header(metadata: Metadata) {
  return (
    <div>
      <h1>{metadata.title}</h1>
      <div>
        <div>
          <i>Written</i>: {metadata.createdTimestamp}
        </div>
        <div className="flex gap-2">
          {metadata.tags.map((value, index) => (
            <Badge key={index}>{value}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer(metadata: Metadata) {
  return (
    <div>
      <div className="flex">
        <div>Revision: {metadata.modifiedTimestamp}</div>
      </div>
    </div>
  );
}

export default function Post({ postData }: { postData: Post }) {
  return (
    <Layout>
      <div className="flex h-full justify-center">
        <div className="prose flex flex-col gap-4 dark:prose-invert">
          <Header {...postData.metadata} />
          <div dangerouslySetInnerHTML={{ __html: postData.content }}></div>
          <Separator />
          <Footer {...postData.metadata} />
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
