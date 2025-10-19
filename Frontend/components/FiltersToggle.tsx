'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FiltersProps } from '@/types';

function FunnelIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export default function FiltersToggle({
    name, setName,
    address, setAddress,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    onApply, onClear,
}: FiltersProps) {
    const [open, setOpen] = useState(false);

    // estados locales
    const [nameL, setNameL] = useState(name ?? '');
    const [addressL, setAddressL] = useState(address ?? '');
    const [minL, setMinL] = useState(minPrice ?? '');
    const [maxL, setMaxL] = useState(maxPrice ?? '');

    // sync con cambios externos (limpiar, etc.)
    useEffect(() => setNameL(name ?? ''), [name]);
    useEffect(() => setAddressL(address ?? ''), [address]);
    useEffect(() => setMinL(minPrice ?? ''), [minPrice]);
    useEffect(() => setMaxL(maxPrice ?? ''), [maxPrice]);

    // aplicar/limpiar
    const handleApply = () => {
        setName(nameL);
        setAddress(addressL);
        setMinPrice(minL);
        setMaxPrice(maxL);
        onApply();
        setOpen(false);
    };

    const handleClear = () => {
        setNameL(''); setAddressL(''); setMinL(''); setMaxL('');
        onClear?.();
        setOpen(false);
    };

    // Enter aplica (en cualquier input)
    const onKeyDownApply: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApply();
        }
    };

    return (
        <div className="relative">
            {/* Botón compacto */}
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-controls="filters-panel"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition"
                title="Filtros"
            >
                <FunnelIcon className="h-5 w-5 text-gray-700" />
                <span className="hidden sm:inline">Filtros</span>
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/30"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />
                        {/* panel, alineado a la derecha */}
                        <motion.div
                            id="filters-panel"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Filtros de búsqueda"
                            className="z-50 absolute right-0 mt-3 w-[min(95vw,720px)] rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md shadow-2xl p-4 sm:p-6
                         sm:top-full fixed sm:absolute bottom-0 sm:bottom-auto"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-gray-600">Nombre</label>
                                    <input
                                        type="text"
                                        value={nameL}
                                        onChange={(e) => setNameL(e.target.value)}
                                        onKeyDown={onKeyDownApply}
                                        placeholder="Ej: Penthouse, Casa…"
                                        className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-600">Dirección</label>
                                    <input
                                        type="text"
                                        value={addressL}
                                        onChange={(e) => setAddressL(e.target.value)}
                                        onKeyDown={onKeyDownApply}
                                        placeholder="Ciudad, barrio…"
                                        className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-600">Precio mín (COP)</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        value={minL}
                                        onChange={(e) => setMinL(e.target.value)}
                                        onKeyDown={onKeyDownApply}
                                        placeholder="0"
                                        className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm text-gray-600">Precio máx (COP)</label>
                                    <input
                                        type="number"
                                        inputMode="numeric"
                                        value={maxL}
                                        onChange={(e) => setMaxL(e.target.value)}
                                        onKeyDown={onKeyDownApply}
                                        placeholder="∞"
                                        className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Limpiar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApply}
                                    className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 active:scale-[0.98]"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
