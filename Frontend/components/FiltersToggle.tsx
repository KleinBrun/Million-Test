"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { FiltersPayload, FiltersProps } from "@/types";

type PropsCompat = Omit<FiltersProps, "onApply" | "onClear"> & {
    onApply: ((next: FiltersPayload) => void) | (() => void);
    onClear?: ((next?: FiltersPayload) => void) | (() => void);
};

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const mql = window.matchMedia("(min-width: 640px)");
        const apply = () => setIsDesktop(mql.matches);
        apply();
        mql.addEventListener("change", apply);
        return () => mql.removeEventListener("change", apply);
    }, []);
    return isDesktop;
}

function FunnelIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export default function FiltersToggle({ name, setName, address, setAddress, minPrice, setMinPrice, maxPrice, setMaxPrice, onApply, onClear, }: PropsCompat) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isDesktop = useIsDesktop();

    const [nameL, setNameL] = useState(name ?? "");
    const [addressL, setAddressL] = useState(address ?? "");
    const [minL, setMinL] = useState(minPrice ?? "");
    const [maxL, setMaxL] = useState(maxPrice ?? "");

    useEffect(() => setMounted(true), []);
    useEffect(() => setNameL(name ?? ""), [name]);
    useEffect(() => setAddressL(address ?? ""), [address]);
    useEffect(() => setMinL(minPrice ?? ""), [minPrice]);
    useEffect(() => setMaxL(maxPrice ?? ""), [maxPrice]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    useEffect(() => {
        if (!open || isDesktop) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open, isDesktop]);

    const handleApply = () => {
        const payload: FiltersPayload = {
            name: (nameL ?? "").trim(),
            address: (addressL ?? "").trim(),
            minPrice: String(minL ?? "").trim(),
            maxPrice: String(maxL ?? "").trim(),
        };

        setName(payload.name);
        setAddress(payload.address);
        setMinPrice(payload.minPrice);
        setMaxPrice(payload.maxPrice);

        if (onApply.length >= 1) {
            (onApply as (p: FiltersPayload) => void)(payload);
        } else {
            (onApply as () => void)();
        }

        setOpen(false);
    };

    const handleClear = () => {
        const empty: FiltersPayload = { name: "", address: "", minPrice: "", maxPrice: "" };
        setNameL("");
        setAddressL("");
        setMinL("");
        setMaxL("");

        if (onClear) {
            if (onClear.length >= 1) {
                (onClear as (p?: FiltersPayload) => void)(empty);
            } else {
                (onClear as () => void)();
            }
        }

        setOpen(false);
    };

    const Form = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleApply();
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "NumpadEnter") {
                    e.preventDefault();
                    handleApply();
                }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
            <div>
                <label className="mb-1 block text-sm text-gray-600">Nombre</label>
                <input
                    type="text"
                    value={nameL}
                    onChange={(e) => setNameL(e.target.value)}
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
                    placeholder="∞"
                    className="w-full rounded-xl border px-3 py-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-300"
                />
            </div>

            <div className="sm:col-span-2 mt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Limpiar
                </button>
                <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-gray-800 active:scale-[0.98]"
                >
                    Aplicar
                </button>
            </div>
        </form>
    );

    const MobileSheet = (
        <AnimatePresence>
            {open && !isDesktop && (
                <>
                    <motion.div
                        className="fixed inset-0 z-[1000] bg-black/45"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Filtros de búsqueda"
                        className="fixed inset-x-0 bottom-0 z-[1001] w-full rounded-t-2xl border border-gray-200 bg-white shadow-2xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-h-[88vh] overflow-y-auto"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{ type: "spring", damping: 26, stiffness: 260 }}
                    >
                        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" aria-hidden />
                        {Form}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    const DesktopPopover = (
        <AnimatePresence>
            {open && isDesktop && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Filtros de búsqueda"
                    className="absolute right-0 top-full z-[60] mt-3 w-[min(95vw,720px)] rounded-2xl border border-gray-200 bg-white shadow-2xl p-6"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                >
                    {Form}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="filters-panel"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-[0.98] transition"
                title="Filtros"
            >
                <FunnelIcon className="h-5 w-5 text-gray-700" />
                <span className="hidden sm:inline">Filtros</span>
            </button>

            {DesktopPopover}

            {mounted ? createPortal(MobileSheet, document.body) : null}
        </div>
    );
}
