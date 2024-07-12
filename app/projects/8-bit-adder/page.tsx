import Link from "next/link";
import Image from "next/image";
import WideShot1Bit from "@/public/projects/8-bit-adder/wide-shot-1-bit.jpg";
import Debug1Bit from "@/public/projects/8-bit-adder/debug-1-bit.jpg";

export default function Page() {
  return (
    <div>
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="prose">
          <h2>Overview</h2>
          <p>
            TODO: I need to sit down this weekend and write about this project
            in full. Also I need to actually make a nice page of this.
          </p>
          <p>
            It was a blast. I learned about KiCad. Starting simulating things in
            Spice, and successfully built an adder using BJTs
          </p>
          <p>
            Disclaimer: I do not think my design is energy efficient nor
            represent a best practice. I hope to take an EE class in graduate
            school if I get in.
          </p>
          <Link
            className="text-lg font-semibold"
            href="https://github.com/michaelfortunato/8-bit-adder"
          >
            https://github.com/michaelfortunato/8-bit-adder
          </Link>
          <div className="flex gap-10">
            <div>
              <Image src={WideShot1Bit} alt="wide-shot-1-bit.jpg" width={400} />
            </div>
            <div>
              <Image src={Debug1Bit} alt="debug-1-bit.jpg" width={400} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
