import { PersonIcon } from "@radix-ui/react-icons";
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

function PageViewsInner({ slug }: { slug: string }) {
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
