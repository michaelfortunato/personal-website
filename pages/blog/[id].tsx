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
  CalendarIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { computeGithubCommitURL } from "@/lib/buildInfo";
import { Clock4 } from "lucide-react";

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
          <div className="flex items-center">
            <TextIcon className="mr-2 inline" />
            {metadata.buildInfo.currentCommit.message}
          </div>
          <div className="flex items-center">
            {/*<TimerIcon className="mr-2 inline" /> */}
            {/* <Clock4 strokeWidth={1} /> */}
            <CalendarIcon className="mr-2 inline" />
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
