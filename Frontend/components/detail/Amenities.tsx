'use client';

import { AmenitiesProps } from '@/types';
import { motion } from 'framer-motion';

export default function Amenities({ items = [], title = 'Amenidades', className = '' }: AmenitiesProps) {
    return (
        <section className={`rounded-2xl border p-5 bg-white ${className}`} aria-labelledby="amenities-title">
            <h3 id="amenities-title" className="font-semibold mb-3">{title}</h3>

            {items.length === 0 ? (
                <p className="text-sm text-gray-500">Sin amenidades registradas.</p>
            ) : (
                <div className="flex flex-wrap gap-2" role="list">
                    {items.map((a) => (
                        <motion.span
                            key={a}
                            role="listitem"
                            className="px-3 py-1.5 rounded-full bg-gray-100 border text-sm text-gray-700"
                            whileHover={{ scale: 1.06 }}
                        >
                            {a}
                        </motion.span>
                    ))}
                </div>
            )}
        </section>
    );
}
