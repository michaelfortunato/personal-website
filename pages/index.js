import React, { useState } from 'react';
import Grid from '@components/Grid';
import Hero from '@components/Hero';
import { AnimatePresence, motion } from 'framer-motion'

const defaultGridConfig = {
    random: true,
    numLines: 12,
    offset: 0,
    avgDuration: 150,
    avgDelay: 1500,
    duration: 750,
    isDot: true
};
export default function Home(props) {
    const [gridEntered, setGridEntered] = useState(false);
    const [triggerNameEnter, setTriggerNameEnter] = useState(false);
    const [triggerGridExit, setTriggerGridExit] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} >
            <AnimatePresence>
                {!triggerGridExit &&
                    <motion.div exit={{ opacity: 0 }}>
                        <Grid setTriggerGridExit={setTriggerGridExit} setTriggerNameEnter={setTriggerNameEnter} {...defaultGridConfig} />
                    </motion.div>
                }
            </AnimatePresence>
            <Hero gridEntered={gridEntered} triggerNameEnter={triggerNameEnter} />
        </motion.div>
    );
}