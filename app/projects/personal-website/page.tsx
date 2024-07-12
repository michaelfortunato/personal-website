import Image from "next/image";
import bundleSizes from "@/public/projects/personal-website/bundle-sizes.png";

export default function Page() {
  return (
    <div>
      <div className="flex justify-center">
        <h1 className="text-6xl">Personal Website</h1>
      </div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="prose">
          <p>
            This uses a bunch of different technologies, like NextJS, GSAP, raw
            CSS animations, Framer Motion, Tailwind CSS. The first page takes
            awhile to load. I thought it had to do with the large JS payload. I
            did a bundle analyzer.
          </p>
          <h2>Bundle Analysis</h2>
          <p>
            While these sizes are not ideal, it turns out AWS cold starts were
            to blame. After switching to Vercel, the time to first contentful
            paint is in good UX range.
          </p>
          <div className="flex justify-center">
            <Image
              src={bundleSizes}
              width={600}
              height={600}
              alt="bundle size image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
