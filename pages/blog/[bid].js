import React, { useState, useEffect } from "react";
import Grid from "@components/Grid";
import Hero from "@components/Hero";
import { AnimatePresence, motion } from "framer-motion";
import Typography from "@material-ui/core/Typography";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import fs from "fs";
import path from "path";
import axios from "axios";
import parser from "fast-xml-parser";
import { assetsURL } from "@utils/configurations";
import markdown from "remark-parse";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
export default function Blog({ mdxSource }) {
  return (
    <div style={{ backgroundColor: "white" }}>
      <MDXRemote {...mdxSource} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  if (process.env.NODE_ENV !== "development") {
    const { data } = await axios.get(`${assetsURL}/blogs/${params.bid}.md`);

    return {
      props: {
        bid: params.bid,
        content: data,
      },
    };
  } else {
    const blogPath = path.join(
      process.cwd(),
      "..",
      assetsURL,
      `${params.bid}.mdx`
    );
    const data = fs.readFileSync(blogPath, "utf-8");

    const mdxSource = await serialize(data, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    });
    return {
      props: {
        mdxSource,
      },
    };
  }
}
export async function getStaticPaths() {
  if (process.env.NODE_ENV !== "development") {
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
  } else {
    const localBlogsFodler = path.join(process.cwd(), "..", assetsURL);
    const blogs = fs.readdirSync(localBlogsFodler);
    const paths = blogs.map((blog) => ({
      params: { bid: blog.replace(".mdx", "") },
    }));
    return {
      paths,
      fallback: false,
    };
  }
}
