import Layout from "@/components/Blog/layout";
import { type Metadata, type Post } from "@/lib/posts";
import { getAllPostIds, getPostData } from "@/lib/server-only/posts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CommitIcon, TextIcon, CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { computeGithubCommitURL } from "@/lib/buildInfo";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function toLocaleStringIfUnixTimestamp(timestamp: string): string {
  const asNumber = Number(timestamp);
  if (!Number.isNaN(asNumber) && asNumber >= -8.64e12 && asNumber <= +8.64e12) {
    return new Date(asNumber * 1000).toLocaleString();
  }
  return timestamp;
}

function Header(metadata: Metadata) {
  const commitHash = metadata.buildInfo.currentCommit.commitHash;
  const hasValidCommitHash = /^[a-f0-9]{40}$/i.test(commitHash);
  const commitUrl = hasValidCommitHash
    ? computeGithubCommitURL("personal-website", commitHash)
    : null;

  return (
    <div>
      <h1>{metadata.title}</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger className="cursor-pointer" asChild>
              <Avatar className="not-prose">
                <AvatarImage src="/blog/Avatar.jpeg" className="mr-2 inline" />
                <AvatarFallback>MNF</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent>
              <Image
                className="rounded"
                src="/blog/Avatar.jpeg"
                width={400}
                height={400}
                alt="Me"
              />
              <p>Me apple picking, circa 2021.</p>
            </DialogContent>
          </Dialog>
          <p className="not-prose inline font-semibold">me</p>
        </div>
        <Card className="p-2 shadow">
          <div className="flex items-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <CommitIcon className="mr-2 inline cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-full p-2 text-center">
                Commit Hash
              </HoverCardContent>
            </HoverCard>
            {commitUrl ? (
              <Link href={commitUrl}>
                {metadata.buildInfo.currentCommit.shortCommitHash}
              </Link>
            ) : (
              <span>{metadata.buildInfo.currentCommit.shortCommitHash}</span>
            )}
          </div>
          <div className="flex items-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <TextIcon className="mr-2 inline cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-full p-2 text-center">
                Commit Message
              </HoverCardContent>
            </HoverCard>
            {metadata.buildInfo.currentCommit.message}
          </div>
          <div className="flex items-center">
            <HoverCard>
              <HoverCardTrigger asChild>
                <CalendarIcon className="mr-2 inline cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-full p-2 text-center">
                Commit Time
              </HoverCardContent>
            </HoverCard>
            {toLocaleStringIfUnixTimestamp(
              metadata.buildInfo.currentCommit.timestamp,
            )}
          </div>
        </Card>
        <div className="flex gap-2">
          {metadata.tags.map((value, index) => (
            <Badge key={index}>{value}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer(_metadata: Metadata) {
  return (
    <div>
      <div className="flex justify-center">
        <div>You made it to the end! Thanks for reading!</div>
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
