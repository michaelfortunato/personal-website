import Layout from "@/components/Blog/layout";
import { Post, Metadata } from "lib/posts";
import { getAllPostIds, getPostData } from "@/lib/server-only/posts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PropsWithChildren, useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GitHubLogoIcon,
  CommitIcon,
  TextIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { computeGithubCommitURL } from "@/lib/buildInfo";

function toLocaleStringIfUnixTimestamp(
  timestamp: number | string,
): number | string {
  if (timestamp >= -8.64e12 && timestamp <= +8.64e12) {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  }
  return timestamp;
}

function HeaderRow({ children }: PropsWithChildren) {
  return <Card className="p-2">{children}</Card>;
}

function useIsMounted() {
  const [isMounted, setIsMoutned] = useState(false);
  useEffect(() => setIsMoutned(true), []);
  return isMounted;
}

function Header(metadata: Metadata) {
  return (
    <div>
      <h1>{metadata.title}</h1>
      <div className="flex flex-col gap-4">
        <Dialog>
          <DialogTrigger className="cursor-pointer" asChild>
            <Avatar className="not-prose">
              <AvatarImage src="/blog/Avatar.jpeg" />
              <AvatarFallback>MNF</AvatarFallback>
            </Avatar>
          </DialogTrigger>
          <DialogContent>
            <div>
              <Image
                src="/blog/Avatar.jpeg"
                width={100}
                height={100}
                alt="Me"
              />
            </div>
          </DialogContent>
        </Dialog>
        <Card className="p-2">
          <div>
            <CommitIcon className="mr-2 inline" />
            <Link
              href={computeGithubCommitURL(
                "personal-website",
                metadata.buildInfo.currentCommit.commitHash,
              )}
            >
              {metadata.buildInfo.currentCommit.shortCommitHash}
            </Link>
          </div>
          <div>
            <TextIcon className="mr-2 inline" />
            {metadata.buildInfo.currentCommit.message}
          </div>
          <div>
            <TimerIcon className="mr-2 inline" />
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

function Footer(metadata: Metadata) {
  return (
    <div>
      <div className="flex">
        <div>
          Updated: {toLocaleStringIfUnixTimestamp(metadata.modifiedTimestamp)}
        </div>
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
