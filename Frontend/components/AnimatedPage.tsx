'use client';

import { AnimatedPageProps } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

export default function AnimatedPage({ pageKey, children, variant = 'fade', }: AnimatedPageProps) {
    const variants = {
        fade: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        slide: {
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -50 },
        },
    } as const;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pageKey}
                initial={variants[variant].initial}
                animate={variants[variant].animate}
                exit={variants[variant].exit}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
