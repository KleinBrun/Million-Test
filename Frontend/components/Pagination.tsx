"use client";

import { PaginationProps } from "@/types";
import { motion } from "framer-motion";
import React from "react";

export default function Pagination({ currentPage, totalPages, onChange, className = "", showInfo = true, pageSize = 6, onPageSizeChange, }: PaginationProps & { pageSize?: number; onPageSizeChange?: (n: number) => void }) {
    const safeTotal = Math.max(totalPages || 1, 1);
    const goFirst = () => onChange(1);
    const goPrev = () => onChange(Math.max(currentPage - 1, 1));
    const goNext = () => onChange(Math.min(currentPage + 1, safeTotal));
    const goLast = () => onChange(safeTotal);

    const baseBtn = "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded-md border transition select-none focus:outline-none focus:ring-2 focus:ring-gray-400/50";
    const enabled = "bg-gray-800 text-white hover:bg-gray-700 active:scale-[0.98]";
    const disabled = "bg-gray-200 text-gray-400 cursor-not-allowed";

    return (
        <div
            className={`w-full flex flex-col sm:flex-row sm:flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-3 ${className}`}
            role="navigation"
            aria-label="Paginación de resultados"
        >
            {onPageSizeChange && (
                <div className="order-2 sm:order-1 flex items-center gap-2 text-sm text-gray-700">
                    <label htmlFor="pageSizeSelect" className="hidden sm:block text-gray-600">
                        Mostrar por página:
                    </label>
                    <label htmlFor="pageSizeSelect" className="sm:hidden sr-only">
                        Tamaño de página
                    </label>
                    <select
                        id="pageSizeSelect"
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none bg-white"
                    >
                        {[6, 9, 12, 15, 18].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="order-1 sm:order-2 flex flex-wrap justify-center items-center gap-2 sm:gap-3">
                <motion.button
                    disabled={currentPage === 1}
                    onClick={goFirst}
                    className={`${baseBtn} ${currentPage === 1 ? disabled : enabled}`}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.04 }}
                    aria-label="Ir a la primera página"
                >
                    <span aria-hidden>«</span>
                    <span className="hidden sm:inline"> Primera</span>
                </motion.button>

                <motion.button
                    disabled={currentPage === 1}
                    onClick={goPrev}
                    className={`${baseBtn} ${currentPage === 1 ? disabled : enabled}`}
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.04 }}
                    aria-label="Página anterior"
                >
                    <span aria-hidden>←</span>
                    <span className="hidden sm:inline"> Anterior</span>
                </motion.button>

                {showInfo && (
                    <span
                        className="text-gray-700 text-xs sm:text-sm px-2 min-w-[8ch] text-center hidden xs:inline sm:inline"
                        aria-live="polite"
                    >
                        Página <strong>{currentPage}</strong> de <strong>{safeTotal}</strong>
                    </span>
                )}

                <motion.button
                    disabled={currentPage === safeTotal}
                    onClick={goNext}
                    className={`${baseBtn} ${currentPage === safeTotal ? disabled : enabled}`}
                    whileHover={{ scale: currentPage === safeTotal ? 1 : 1.04 }}
                    aria-label="Página siguiente"
                >
                    <span className="hidden sm:inline">Siguiente </span>
                    <span aria-hidden>→</span>
                </motion.button>

                <motion.button
                    disabled={currentPage === safeTotal}
                    onClick={goLast}
                    className={`${baseBtn} ${currentPage === safeTotal ? disabled : enabled}`}
                    whileHover={{ scale: currentPage === safeTotal ? 1 : 1.04 }}
                    aria-label="Ir a la última página"
                >
                    <span className="hidden sm:inline">Última </span>
                    <span aria-hidden>»</span>
                </motion.button>
            </div>

            {showInfo && (
                <div className="order-3 sm:hidden text-gray-600 text-xs" aria-hidden>
                    Página {currentPage} / {safeTotal}
                </div>
            )}
        </div>
    );
}
