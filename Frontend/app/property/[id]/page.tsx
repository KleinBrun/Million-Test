'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePropertyStore } from '@/stores/propertyStore';
import ActionsBar from '@/components/detail/ActionsBar';
import Gallery from '@/components/detail/Gallery';
import DetailsCard from '@/components/detail/DetailsCard';
import MortgageCard from '@/components/detail/MortgageCard';
import OwnerCard from '@/components/detail/OwnerCard';
import TracesTable from '@/components/detail/TracesTable';
import Amenities from '@/components/detail/Amenities';
import MapEmbed from '@/components/detail/MapEmbed';

export default function PropertyDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const rehydrated = usePropertyStore((s) => s.rehydrated);
    const property = usePropertyStore((s) => s.getOne(id));

    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!rehydrated) return;
        setNotFound(!property);
    }, [rehydrated, property]);

    const formatCOP = (n?: number) =>
        n == null ? '' : new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(n);

    const formatUSD = (n?: number) =>
        n == null ? '' : new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(n);

    const priceFormatted = useMemo(() => formatUSD(property?.price), [property?.price]);

    const galleryImages = useMemo(() => {
        const imgs = (property as any)?.images as any[] | undefined;
        if (Array.isArray(imgs) && imgs.length > 0) return imgs;
        if ((property as any)?.image) return [(property as any).image];
        return [];
    }, [property]);

    const specs = useMemo(
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

    const amenities = useMemo(() => ['Parqueadero', 'Gimnasio', 'Piscina', 'Vigilancia 24/7', 'Ascensor', 'Zona BBQ', 'Coworking'], []);

    const mortgage = useMemo(() => ({ rateMonthly: 0.0125, years: 20, downPct: 0.2 }), []);
    const monthlyUSD = useMemo(() => {
        if (!property?.price) return null;
        const P = property.price * (1 - mortgage.downPct);
        const i = mortgage.rateMonthly;
        const n = mortgage.years * 12;
        return Math.round((P * i) / (1 - Math.pow(1 + i, -n)));
    }, [property?.price, mortgage]);

    const mapAddress = property?.address ?? 'Bogotá, Colombia';

    const share = async () => {
        try {
            if (navigator.share && property) {
                await navigator.share({
                    title: property.name,
                    text: `${property.name} - ${priceFormatted}`,
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

    const fadeInUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

    if (!rehydrated) return null;

    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h2>
                <p className="text-gray-500 mb-6">
                    La información de esta propiedad no está disponible. Vuelve al inicio y selecciona una desde el listado.
                </p>
                <motion.button
                    onClick={() => router.push('/')}
                    className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    ← Volver al inicio
                </motion.button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <ActionsBar title={property?.name} onShare={share} onCopyId={copyId} />

            <motion.div {...fadeInUp} className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-bold">{property?.name}</h1>
                <p className="text-gray-600">{property?.address}</p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl md:text-4xl font-extrabold text-green-700">{priceFormatted}</span>
                    <span className="text-sm text-gray-500">Precio</span>
                </div>
            </motion.div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div {...fadeInUp} className="md:col-span-2">
                    <Gallery title={property?.name} images={galleryImages} />
                </motion.div>

                <motion.aside {...fadeInUp} className="space-y-4 md:col-span-1">
                    {'owner' in (property as any) && (
                        <OwnerCard owner={(property as any).owner} />
                    )}

                    <DetailsCard
                        beds={specs.beds}
                        baths={specs.baths}
                        areaM2={specs.areaM2}
                        type={specs.type}
                        year={specs.year}
                        hoaCOP={specs.hoaCOP}
                        formatCOP={formatCOP}
                    />

                    <MortgageCard
                        monthlyUSD={monthlyUSD}
                        formatUSD={formatUSD}
                        rateMonthly={mortgage.rateMonthly}
                        years={mortgage.years}
                        downPct={mortgage.downPct}
                    />
                </motion.aside>
            </section>

            {'traces' in (property as any) && (<TracesTable traces={(property as any).traces} formatCOP={formatCOP} />)}
            <Amenities items={amenities} />
            <MapEmbed address={mapAddress} />
        </div>
    );
}
