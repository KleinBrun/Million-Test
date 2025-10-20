'use client';

import { PropsActionBar } from '@/types';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Home } from 'lucide-react';

export default function ActionsBar({ title, onShare }: PropsActionBar) {
    const router = useRouter();
    const hoverTap = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { duration: 0.15 } };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <nav className="text-sm" aria-label="breadcrumb">
                <ol
                    className="flex items-center gap-2 text-gray-500 min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]
                     [&::-webkit-scrollbar]:hidden"
                >
                    <li className="shrink-0">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-1 hover:text-gray-800 underline-offset-2 hover:underline"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden xs:inline">Inicio</span>
                        </button>
                    </li>
                    <li className="text-gray-400 shrink-0">/</li>
                    <li className="text-gray-800 font-semibold min-w-0">
                        <span className="block truncate max-w-[70vw] sm:max-w-none">{title}</span>
                    </li>
                </ol>
            </nav>

            <div className="flex flex-wrap justify-start sm:justify-end gap-2">
                <motion.button
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                    {...hoverTap}
                    onClick={onShare}
                    aria-label="Compartir"
                >
                    <span className="hidden sm:inline">Compartir</span>
                    <span className="sm:hidden">Share</span>
                </motion.button>

                <motion.button
                    className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                    {...hoverTap}
                    onClick={() => (window.location.href = 'mailto:')}
                    aria-label="Enviar correo"
                >
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Correo</span>
                </motion.button>

                <motion.button
                    onClick={() => router.back()}
                    className="bg-gray-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-800 text-sm"
                    {...hoverTap}
                >
                    ← <span className="hidden sm:inline">Volver</span>
                </motion.button>
            </div>
        </div>
    );
}
