'use client';

import { PaginationProps } from '@/types';
import { motion } from 'framer-motion';

export default function Pagination({
    currentPage,
    totalPages,
    onChange,
    className = '',
    showInfo = true,
    pageSize = 6,
    onPageSizeChange,
}: PaginationProps & { pageSize?: number; onPageSizeChange?: (n: number) => void }) {
    const goFirst = () => onChange(1);
    const goPrev = () => onChange(Math.max(currentPage - 1, 1));
    const goNext = () => onChange(Math.min(currentPage + 1, totalPages));
    const goLast = () => onChange(totalPages);

    const baseBtn =
        'px-4 py-2 rounded border transition select-none focus:outline-none focus:ring-2 focus:ring-gray-400/50';
    const enabled = 'bg-gray-800 text-white hover:bg-gray-700';
    const disabled = 'bg-gray-200 text-gray-400 cursor-not-allowed';

    return (
        <div
            className={`flex flex-wrap justify-center items-center gap-3 ${className}`}
            role="navigation"
            aria-label="Paginación de resultados"
        >
            {/* Selector de cantidad por página */}
            {onPageSizeChange && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <label htmlFor="pageSizeSelect" className="text-gray-600">
                        Mostrar:
                    </label>
                    <select
                        id="pageSizeSelect"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                    >
                        {[6, 9, 12, 15, 18].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <motion.button
                disabled={currentPage === 1}
                onClick={goFirst}
                className={`${baseBtn} ${currentPage === 1 ? disabled : enabled}`}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                aria-label="Ir a la primera página"
            >
                « Primera
            </motion.button>

            <motion.button
                disabled={currentPage === 1}
                onClick={goPrev}
                className={`${baseBtn} ${currentPage === 1 ? disabled : enabled}`}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                aria-label="Página anterior"
            >
                ← Anterior
            </motion.button>

            {showInfo && (
                <span className="text-gray-700 text-sm px-2">
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                </span>
            )}

            <motion.button
                disabled={currentPage === totalPages}
                onClick={goNext}
                className={`${baseBtn} ${currentPage === totalPages ? disabled : enabled
                    }`}
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                aria-label="Página siguiente"
            >
                Siguiente →
            </motion.button>

            <motion.button
                disabled={currentPage === totalPages}
                onClick={goLast}
                className={`${baseBtn} ${currentPage === totalPages ? disabled : enabled
                    }`}
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                aria-label="Ir a la última página"
            >
                Última »
            </motion.button>
        </div>
    );
}
