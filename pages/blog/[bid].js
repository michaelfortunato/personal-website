import React, { useState, useEffect } from "react";
import Grid from "@components/Grid";
import Hero from "@components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import path from "path";
import axios from "axios";
import parser from "fast-xml-parser";
import { assetsURL } from "@utils/configurations";

export default function Blog(props) {
  return (
    <div style={{ backgroundColor: "white" }}>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {props.content}
      </ReactMarkdown>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await axios.get(`${assetsURL}/blogs/${params.bid}.md`);

  return {
    props: {
      bid: params.bid,
      content: data,
    },
  };
}
export async function getStaticPaths() {
  const { data } = await axios.get(`${assetsURL}/`, {
    params: {
      "list-type": 2,
      prefix: "blogs/",
      delimiter: "/",
      Bucket: "assets.michaelfortunato.org",
    },
  });
  let {
    ListBucketResult: { Contents },
  } = parser.parse(data);
  if (!Array.isArray(Contents)) {
    Contents = [Contents];
  }
  const paths = Contents.map(({ Key }) => ({
    params: {
      bid: Key.split("/").pop().replace(".md", ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
