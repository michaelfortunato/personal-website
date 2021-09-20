import React, { useState, useEffect } from 'react';
import Grid from '@components/Grid';
import Hero from '@components/Hero';
import { AnimatePresence, motion } from 'framer-motion'
import fs from "fs"
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import path from 'path';

const blogsDir = process.cwd() + path.sep + "_blogs"
export default function Blog(props) {
    return <div>
        <Typography variant="h2">{props.bid}</Typography>
        <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >{props.content}
        </ReactMarkdown>
    </div>
}

export async function getStaticProps({ params }) {
    const content = fs.readFileSync(blogsDir + path.sep + params.bid, "utf-8");
    return {
        props: {
            bid: params.bid,
            content: content
        }
    }
}
export async function getStaticPaths() {
    const paths = fs.readdirSync(blogsDir).map(file => ({ params: { bid: file } }));
    return {
        paths: paths,
        fallback: false // 'blocking' // See the "fallback" section below
    };
}