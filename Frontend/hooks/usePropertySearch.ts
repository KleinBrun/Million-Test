'use client';

import { useEffect, useState } from 'react';
import { getProperties } from '@/services/propertyService';
import { usePropertyStore } from '@/stores/propertyStore';
import type { Property } from '@/types';

const LISTING_SESSION_FLAG = 'listingSessionActive';

export function usePropertySearch(initialPageSize = 6) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState<number>(initialPageSize);

    const filters = usePropertyStore((s) => s.filters);
    const setFilters = usePropertyStore((s) => s.setFilters);
    const setMany = usePropertyStore((s) => s.setMany);
    const rehydrated = usePropertyStore((s) => s.rehydrated);

    const { name, address, minPrice, maxPrice, currentPage } = filters;

    const fetchProperties = (
        page = 1,
        size = pageSize,
        f?: { name: string; address: string; minPrice: string; maxPrice: string }
    ) => {
        const n = f?.name ?? name;
        const a = f?.address ?? address;
        const mi = f?.minPrice ?? minPrice;
        const ma = f?.maxPrice ?? maxPrice;

        setLoading(true);
        setError(null);

        return getProperties({
            name: n || undefined,
            address: a || undefined,
            minPrice: mi ? Number(mi) : undefined,
            maxPrice: ma ? Number(ma) : undefined,
            page,
            pageSize: size,
        })
            .then((res) => {
                setProperties(res.data);
                setTotalPages(res.totalPages);
                setMany(res.data);
            })
            .catch((err: any) => setError(err?.message ?? 'Error inesperado'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!rehydrated) return;

        const isNewTab = !sessionStorage.getItem(LISTING_SESSION_FLAG);

        if (isNewTab) {
            sessionStorage.setItem(LISTING_SESSION_FLAG, '1');
            setPageSize(initialPageSize);
            setFilters({
                name: '',
                address: '',
                minPrice: '',
                maxPrice: '',
                currentPage: 1,
            });
            fetchProperties(1, initialPageSize);
        } else {
            fetchProperties(currentPage, pageSize);
        }
    }, [rehydrated]);

    useEffect(() => {
        if (!rehydrated) return;
        fetchProperties(currentPage, pageSize);
    }, [currentPage]);

    useEffect(() => {
        if (!rehydrated) return;
        setFilters({ currentPage: 1 });
        fetchProperties(1, pageSize);
    }, [pageSize]);

    const applyFilters = (next?: { name: string; address: string; minPrice: string; maxPrice: string }) => {
        const filtersToUse = next ?? { name, address, minPrice, maxPrice };

        setFilters({
            name: filtersToUse.name,
            address: filtersToUse.address,
            minPrice: filtersToUse.minPrice,
            maxPrice: filtersToUse.maxPrice,
            currentPage: 1,
        });

        fetchProperties(1, pageSize, filtersToUse);
    };

    const clearFilters = () => {
        setLoading(true);
        setFilters({
            name: '',
            address: '',
            minPrice: '',
            maxPrice: '',
            currentPage: 1,
        });
        getProperties({ page: 1, pageSize })
            .then((res) => {
                setProperties(res.data);
                setTotalPages(res.totalPages);
                setMany(res.data);
            })
            .catch((err: any) => setError(err?.message ?? 'Error inesperado'))
            .finally(() => setLoading(false));
    };

    const setters = {
        setName: (v: string) => setFilters({ name: v }),
        setAddress: (v: string) => setFilters({ address: v }),
        setMinPrice: (v: string) => setFilters({ minPrice: v }),
        setMaxPrice: (v: string) => setFilters({ maxPrice: v }),
        setPage: (p: number) => setFilters({ currentPage: p }),
    };

    return {
        properties,
        loading,
        error,
        totalPages,
        currentPage,
        pageSize,
        setPageSize,
        name,
        address,
        minPrice,
        maxPrice,
        applyFilters,
        clearFilters,
        fetchProperties,
        ...setters,
    };
}
