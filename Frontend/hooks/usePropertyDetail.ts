'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePropertyStore } from '@/stores/propertyStore';
import { formatCOP, formatUSD } from '@/utils/format';
import { Specs } from '@/types';

export function usePropertyDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const rehydrated = usePropertyStore((s) => s.rehydrated);
    const getOne = usePropertyStore((s) => s.getOne);
    const property = getOne(id);

    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!rehydrated) return;
        setNotFound(!property);
    }, [rehydrated, property]);

    const priceFormatted = useMemo(() => formatUSD((property as any)?.price), [property]);

    const galleryImages = useMemo(() => {
        const imgs = (property as any)?.images as any[] | undefined;
        if (Array.isArray(imgs) && imgs.length > 0) return imgs;
        if ((property as any)?.image) return [(property as any).image];
        return [];
    }, [property]);

    const specs: Specs = useMemo(
        () => ({
            beds: 3,
            baths: 2,
            areaM2: 128,
            type: 'Apartamento',
            year: (property as any)?.year ?? 2021,
            hoaCOP: 380_000,
        }),
        [property]
    );

    const amenities = useMemo(
        () => ['Parqueadero', 'Gimnasio', 'Piscina', 'Vigilancia 24/7', 'Ascensor', 'Zona BBQ', 'Coworking'], []
    );

    const mortgage = useMemo(() => ({ rateMonthly: 0.0125, years: 20, downPct: 0.2 }), []);
    const monthlyUSD = useMemo(() => {
        const price = (property as any)?.price as number | undefined;
        if (!price) return null;
        const P = price * (1 - mortgage.downPct);
        const i = mortgage.rateMonthly;
        const n = mortgage.years * 12;
        return Math.round((P * i) / (1 - Math.pow(1 + i, -n)));
    }, [property, mortgage]);

    const mapAddress = (property as any)?.address ?? 'Bogotá, Colombia';

    const share = async () => {
        try {
            if (navigator.share && property) {
                await navigator.share({
                    title: (property as any)?.name,
                    text: `${(property as any)?.name} - ${priceFormatted}`,
                    url: typeof window !== 'undefined' ? window.location.href : '',
                });
            }
        } catch { }
    };

    const copyId = async () => {
        try {
            const pid = (property as any)?.idProperty ?? (property as any)?.id ?? id;
            if (pid) await navigator.clipboard.writeText(String(pid));
        } catch { }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
    };

    return {
        rehydrated,
        notFound,
        property,
        priceFormatted,
        galleryImages,
        specs,
        amenities,
        mortgage,
        monthlyUSD,
        mapAddress,
        formatCOP,
        formatUSD,
        share,
        copyId,
        fadeInUp,
        goHome: () => router.push('/'),
    };
}
