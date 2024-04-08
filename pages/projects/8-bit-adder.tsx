import Link from "next/link";
import Image from "next/image";
import { Layout, TileFactory } from ".";
import WideShot1Bit from "@/public/projects/8-bit-adder/wide-shot-1-bit.jpg";
import Debug1Bit from "@/public/projects/8-bit-adder/debug-1-bit.jpg";
import Diagram1Bit from "@/public/projects/8-bit-adder/1-bit-adder-diagram.png";

export function Tile() {
  return TileFactory(
    "8 Bit Adder",
    <TileLeftSide />,
    <TileRightSide />,
    "8-bit-adder",
  );
}

function TileLeftSide() {
  return (
    <div>
      <div className="text-base">
        <p>
          This was my first electrical engineering project. Click{" "}
          <Link
            className="font-semibold"
            href="/projects/8-bit-adder/1_bit_adder_image.pdf"
            target="_blank"
          >
            here
          </Link>{" "}
          to download the full electrical diagram or see{" "}
          <Link
            className="font-semibold"
            href="https://github.com/michaelfortunato/8-bit-adder"
            target="_blank"
          >
            here
          </Link>{" "}
          for the project (still in progress).
        </p>
      </div>
    </div>
  );
}

function TileRightSide() {
  return (
    <div className="flex gap-4">
      <Image src={WideShot1Bit} alt="ee-setup.jpg" width={200} />
      <Image src={Diagram1Bit} alt="1-bit-adder-diagram.png" width={200} />
    </div>
  );
}

export default function Page() {
  return (
    <Layout url="/projects/8-bit-adder">
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
    </Layout>
  );
}
