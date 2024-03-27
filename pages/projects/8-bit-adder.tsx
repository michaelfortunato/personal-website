import { motion } from "framer-motion";
import Link from "next/link";
import { Layout, TileFactory } from ".";

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
      <div className="text-base">8 Bit Adder</div>
    </div>
  );
}

function TileRightSide() {
  return (
    <div>
      <h1>This was my first electrical engineering project</h1>
    </div>
  );
}

export default function Page() {
  return (
    <Layout url="/projects/8-bit-adder">
      <Link href="/projects">
        <motion.h1 layout="position">Expanded</motion.h1>
      </Link>
      <h2>Section 1</h2>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Risus feugiat in
        ante metus dictum at tempor commodo. Nam aliquam sem et tortor consequat
        id porta nibh venenatis. Luctus accumsan tortor posuere ac ut consequat
        semper viverra. Pulvinar elementum integer enim neque. In pellentesque
        massa placerat duis. Ut etiam sit amet nisl purus. Nulla pellentesque
        dignissim enim sit amet. Condimentum id venenatis a condimentum vitae
      </div>
      <h2>Section 2</h2>
      <div>
        sapien pellentesque habitant. Non blandit massa enim nec. Ornare
        suspendisse sed nisi lacus sed viverra tellus in. Hendrerit dolor magna
        eget est. Nisi vitae suscipit tellus mauris a diam maecenas sed. Sed
        vulputate mi sit amet mauris commodo quis imperdiet. Ac turpis egestas
        maecenas pharetra. Amet justo donec enim diam vulputate ut. Porttitor
        eget dolor morbi non arcu risus. Amet consectetur adipiscing elit duis
        tristique sollicitudin nibh. Ac turpis egestas integer eget. Ullamcorper
        morbi tincidunt ornare massa eget egestas. Augue ut lectus arcu bibendum
        at varius vel pharetra vel. Potenti nullam ac tortor vitae purus. Morbi
        tincidunt augue interdum velit euismod. Nulla facilisi nullam vehicula
        ipsum a. Mattis nunc sed blandit libero. Mattis nunc sed blandit libero
        volutpat. Lorem donec massa sapien faucibus et molestie ac. In dictum
        non consectetur a erat nam. Ullamcorper malesuada proin libero nunc.
        Interdum posuere lorem ipsum dolor. Ac orci phasellus egestas tellus
        rutrum. Lectus sit amet est placerat in. Volutpat ac tincidunt vitae
      </div>
      <h2>Section 2</h2>
      <div>
        semper. Massa ultricies mi quis hendrerit dolor magna eget. Et ligula
        ullamcorper malesuada proin libero nunc consequat. Auctor eu augue ut
        lectus arcu bibendum at. Quam lacus suspendisse faucibus interdum
        posuere lorem ipsum dolor. Elementum eu facilisis sed odio morbi quis
        commodo odio aenean. In tellus integer feugiat scelerisque varius. Vitae
        semper quis lectus nulla at volutpat. Vitae proin sagittis nisl rhoncus
        mattis rhoncus. Nisi vitae suscipit tellus mauris. Mi quis hendrerit
        dolor magna eget. Tempus egestas sed sed risus pretium quam vulputate.
        Tristique et egestas quis ipsum suspendisse ultrices gravida dictum
        fusce. At urna condimentum mattis pellentesque id nibh. Ipsum nunc
        aliquet bibendum enim facilisis gravida neque. Diam volutpat commodo sed
        egestas egestas fringilla. Ut eu sem integer vitae justo eget magna
        fermentum. Lectus mauris ultrices eros in cursus turpis massa tincidunt
      </div>
      <h2>Section 2</h2>
      <div>
        dui. Ipsum a arcu cursus vitae. Fusce ut placerat orci nulla
        pellentesque dignissim enim sit amet. Pellentesque eu tincidunt tortor
        aliquam. Ipsum suspendisse ultrices gravida dictum. Euismod elementum
        nisi quis eleifend quam adipiscing vitae. Tincidunt praesent semper
        feugiat nibh sed. Suspendisse in est ante in nibh. Et malesuada fames ac
        turpis egestas sed tempus urna et. A lacus vestibulum sed arcu non odio.
        Praesent tristique magna sit amet purus gravida quis blandit. Leo vel
        fringilla est ullamcorper eget nulla facilisi etiam dignissim. Cras
        adipiscing enim eu turpis. Id diam vel quam elementum pulvinar etiam
        non. Lobortis mattis aliquam faucibus purus in massa tempor nec. Ante in
        nibh mauris cursus mattis. Vitae nunc sed velit dignissim. Sed viverra
        tellus in hac habitasse platea. Non curabitur gravida arcu ac tortor
        dignissim convallis aenean et. Et netus et malesuada fames ac turpis
        egestas sed. Neque vitae tempus quam pellentesque nec nam aliquam sem.
      </div>
      <h2>Section 2</h2>
      <div>
        Duis at consectetur lorem donec massa. Ipsum faucibus vitae aliquet nec
        ullamcorper sit. Scelerisque purus semper eget duis at tellus at. Urna
        duis convallis convallis tellus. Praesent tristique magna sit amet purus
        gravida quis. Ut ornare lectus sit amet est. Diam donec adipiscing
        tristique risus nec feugiat. Mattis rhoncus urna neque viverra justo nec
        ultrices dui. Duis tristique sollicitudin nibh sit amet. Facilisis magna
        etiam tempor orci eu lobortis elementum nibh tellus. At elementum eu
        facilisis sed odio. Eget nullam non nisi est.
      </div>
    </Layout>
  );
}
