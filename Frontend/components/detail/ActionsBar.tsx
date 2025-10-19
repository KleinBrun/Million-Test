'use client';

import { PropsActionBar } from '@/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ActionsBar({ title, onShare, onCopyId }: PropsActionBar) {
    const router = useRouter();
    const pop = { whileHover: { scale: 1.03 }, transition: { duration: 0.2 } };

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="text-sm text-gray-500" aria-label="breadcrumb">
                <button onClick={() => router.push('/')} className="underline underline-offset-2 hover:text-gray-800">
                    Inicio
                </button>{' '}
                / <span className="text-gray-800 font-medium">{title}</span>
            </nav>

            <div className="flex gap-2">
                <motion.button
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    {...pop}
                    onClick={onShare}
                    aria-label="Compartir"
                >
                    Compartir
                </motion.button>
                <motion.button
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    {...pop}
                    onClick={onCopyId}
                    title="Copiar ID"
                >
                    Copiar ID
                </motion.button>
                <motion.button onClick={() => router.back()} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800" {...pop}>
                    ← Volver
                </motion.button>
            </div>
        </div>
    );
}
