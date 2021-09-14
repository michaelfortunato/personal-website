import React, { useState, useEffect } from 'react';
import Grid from '@components/Grid';
import Hero from '@components/Hero';
import { AnimatePresence, motion } from 'framer-motion'
import fs from "fs"
import Typography from '@material-ui/core/Typography';
import ReactMarkdown from 'react-markdown/react-markdown.min'
const defaultGridConfig = {
    random: true,
    numLines: 12,
    offset: 0,
    avgDuration: 150,
    avgDelay: 1500,
    duration: 750,
    isDot: true
};
export default function Blog(props) {
    return <div>
        <Typography variant="h2">{props.bid}</Typography>
        <ReactMarkdown>{props.content}</ReactMarkdown>
    </div>
}
export async function getStaticProps({ params }) {
    const content = fs.readFileSync("/Users/michaelfortunato/website-nextjs/_blogs/" + params.bid, "utf-8");
    return {
        props: {
            bid: params.bid,
            content: content
        }
    }
}
export async function getStaticPaths() {
    let paths = []
    fs.readdirSync("/Users/michaelfortunato/website-nextjs/_blogs").forEach(file => {
        paths.push({ params: { bid: file } })
    })
    return {
        paths: paths,
        fallback: false // 'blocking' // See the "fallback" section below
    };
}