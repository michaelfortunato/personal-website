import Link from "next/link";
import { TileFactory } from "../TileFactory";
import WideShot1Bit from "@/public/projects/8-bit-adder/wide-shot-1-bit.jpg";
import Diagram1Bit from "@/public/projects/8-bit-adder/1-bit-adder-diagram.png";
import Image from "next/image";

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
export function Tile() {
  return TileFactory(
    "8 Bit Adder",
    <TileLeftSide />,
    <TileRightSide />,
    "8-bit-adder",
  );
}
