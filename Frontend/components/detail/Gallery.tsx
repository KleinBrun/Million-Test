'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryProps } from '@/types';

export default function Gallery({ title, images, className = '' }: GalleryProps) {
    const [active, setActive] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const normalized = useMemo(() => {
        const list = (images ?? [])
            .map((i) => (typeof i === 'string' ? { file: i, enabled: true } : i))
            .filter((i) => i?.enabled && !!i?.file)
            .map((i) => i.file);
        return list.length > 0 ? list : ['SIN_IMAGEN'];
    }, [images]);

    const total = normalized.length;
    const goNext = () => setActive((i) => (i + 1) % total);
    const goPrev = () => setActive((i) => (i - 1 + total) % total);
    const goIndex = (idx: number) => setActive(((idx % total) + total) % total);

    useEffect(() => {
        if (total <= 1 || isHovered) return;
        const t = setInterval(goNext, 3500);
        return () => clearInterval(t);
    }, [total, isHovered]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, [total]);

    return (
        <motion.div
            className={className}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={ref}
                className="relative rounded-2xl overflow-hidden bg-gray-100 outline-none"
                tabIndex={0}
                aria-roledescription="carrusel"
            >
                <AnimatePresence mode="wait">
                    {normalized[active] === 'SIN_IMAGEN' ? (
                        <div className="w-full h-[420px] md:h-[520px] flex items-center justify-center text-gray-500 text-lg font-medium">
                            Sin imagen
                        </div>
                    ) : (
                        <motion.img
                            key={active}
                            src={normalized[active]}
                            alt={title ? `${title} imagen ${active + 1}` : `Imagen ${active + 1}`}
                            className="w-full h-[420px] md:h-[520px] object-cover"
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    )}
                </AnimatePresence>

                {total > 1 && (
                    <>
                        <motion.button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
                            whileHover={{ scale: 1.05 }}
                            aria-label="Imagen anterior"
                        >
                            ‹
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={goNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
                            whileHover={{ scale: 1.05 }}
                            aria-label="Imagen siguiente"
                        >
                            ›
                        </motion.button>

                        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
                            {normalized.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goIndex(i)}
                                    className={`h-2.5 w-2.5 rounded-full ${i === active ? 'bg-white' : 'bg-white/50'}`}
                                    aria-label={`Ir a imagen ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}
