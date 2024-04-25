import { Post, Metadata } from "lib/posts";
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
import PageViews from "@/components/PageViews";
import MeApplePicking from "@/public/blog/Avatar.jpeg";

function toLocaleStringIfUnixTimestamp(timestamp: string): number | string {
  // @ts-ignore
  if ((timestamp as number) >= -8.64e12 && (timestamp as number) <= +8.64e12) {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  }
  return timestamp;
}

function Header(metadata: Metadata) {
  return (
    <div>
      <h1>{metadata.title}</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger className="cursor-pointer" asChild>
                <Avatar className="not-prose">
                  <AvatarImage
                    src="/blog/Avatar.jpeg"
                    className="mr-2 inline"
                  />
                  <AvatarFallback>MNF</AvatarFallback>
                </Avatar>
              </DialogTrigger>
              <DialogContent>
                <Image
                  className="rounded"
                  src={MeApplePicking}
                  width={400}
                  height={400}
                  alt="Me"
                />
                <p>Me apple picking, circa 2021.</p>
              </DialogContent>
            </Dialog>
            <p className="not-prose inline font-semibold">me</p>
          </div>
          <PageViews slug={metadata.id} />
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
                {/*<TimerIcon className="mr-2 inline" /> */}
                {/* <Clock4 strokeWidth={1} /> */}
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

function Footer(metadata: Metadata) {
  return (
    <div>
      <div className="flex justify-center">
        <div>You made it to the end! Thanks for reading!</div>
      </div>
    </div>
  );
}

// import pg from "pg";
// import PageViews from "@/components/PageViews";
// const { Pool, Client } = pg;
//   const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
//   const res = await pool.query("SELECT NOW()");
//   await pool.end();

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const postData = await getPostData(id);

  return (
    <div className="flex h-full justify-center">
      <div className="prose flex flex-col gap-4 dark:prose-invert">
        <Header {...postData.metadata} />
        <div dangerouslySetInnerHTML={{ __html: postData.content }}></div>
        <Separator />
        <Footer {...postData.metadata} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths;
}
