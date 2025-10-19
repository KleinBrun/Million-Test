import { ReactNode } from "react";
import type { Trace } from "./domain";

export type AnimatedPageProps = {
    pageKey: string | number;
    children: ReactNode;
    variant?: "fade" | "slide";
};

export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
    className?: string;
    showInfo?: boolean;
    mode?: 'auto' | 'manual';
    pageSize?: number;
    pageSizeOptions?: number[];
    onModeChange?: (m: 'auto' | 'manual') => void;
    onPageSizeChange?: (n: number) => void;
};

export type PropsActionBar = {
    title?: string;
    onShare?: () => void;
    onCopyId?: () => void;
};

export type AmenitiesProps = {
    items?: string[];
    title?: string;
    className?: string;
};

export type DetailsCardProps = {
    beds?: number;
    baths?: number;
    areaM2?: number;
    type?: string;
    year?: number | string;
    hoaCOP?: number;
    formatCOP: (n?: number) => string;
    title?: string;
    className?: string;
};

export type GalleryImage = { file: string; enabled?: boolean } | string;

export type GalleryProps = {
    title?: string;
    images: GalleryImage[] | undefined;
    className?: string;
};

export type MapsProps = { address: string };

export type MortgageCardProps = {
    monthlyUSD?: number | null;
    formatUSD: (n?: number) => string;
    rateMonthly: number;
    years: number;
    downPct: number;
};

export type TraceProps = {
    traces?: Trace[];
    formatCOP: (n?: number) => string;
};
