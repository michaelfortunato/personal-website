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

import { Pool, Client } from "pg";

export async function recordVisit(url: string, ip: string): Promise<any> {
  const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
  try {
    const res = await pool.query(
      "SELECT num_visits, updated_at from visitors where url=$1 AND ip=$2;",
      [url, ip],
    );
    if (res.rowCount == 1) {
      console.log(res.rows);
      const { num_visits, updated_at } = res.rows[0];
      console.log(num_visits, updated_at);
    } else if (res.rowCount == 0) {
      const res2 = await pool.query(
        "INSERT INTO visitors (url, ip, num_visits) VALUES ($1, $2, 1);",
        [url, ip],
      );
      console.log(res2);
    }
  } finally {
    await pool.end();
  }
  return undefined;
}

async function PageViewsInner({ slug }: { slug: string }) {
  const h = headers();
  const ip = h.get("x-forwarded-for") ?? "127.0.0.10";
  const res = await recordVisit(slug, ip);

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
