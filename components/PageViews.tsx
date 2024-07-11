import Link from "next/link";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { PersonIcon } from "@radix-ui/react-icons";
import { headers } from "next/headers";
import { Suspense } from "react";

type Props = {
  preview?: boolean;
  children: React.ReactNode;
};

function PageViewsUI({ numViews }: { numViews: number }) {
  return (
    <div className="flex items-center rounded px-2 py-1 text-muted-foreground shadow">
      <PersonIcon />
      <span>{numViews}</span>
    </div>
  );
}

async function PageViewsInner({ slug }: { slug: string }) {
  const h = headers();
  const ip = h.get("x-forwarded-for") ?? "127.0.0.10";
  // const res = await recordVisit(slug, ip);

  return (
    <div className="flex items-center rounded px-2 py-1 text-muted-foreground shadow">
      <PersonIcon />
      <span>SOON</span>
    </div>
  );
}

export default function PageViews({ slug }: { slug: string }) {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <PageViewsInner slug={slug} />
    </Suspense>
  );
}
