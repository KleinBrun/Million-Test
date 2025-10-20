'use client';

import { motion } from 'framer-motion';
import ActionsBar from '@/components/detail/ActionsBar';
import Gallery from '@/components/detail/Gallery';
import DetailsCard from '@/components/detail/DetailsCard';
import MortgageCard from '@/components/detail/MortgageCard';
import OwnerCard from '@/components/detail/OwnerCard';
import TracesTable from '@/components/detail/TracesTable';
import Amenities from '@/components/detail/Amenities';
import MapEmbed from '@/components/detail/MapEmbed';
import { usePropertyDetail } from '@/hooks/usePropertyDetail';
import CompanyContact from '@/components/detail/CompanyContact';

export default function PropertyDetailPage() {
    const {
        rehydrated, notFound, property, priceFormatted, galleryImages, specs,
        amenities, mortgage, monthlyUSD, mapAddress, formatCOP,
        formatUSD, share, fadeInUp, goHome,
    } = usePropertyDetail();

    if (!rehydrated) return null;

    if (notFound || !property) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Propiedad no encontrada</h2>
                <p className="text-gray-500 mb-6">
                    La información de esta propiedad no está disponible. Vuelve al inicio y selecciona una desde el listado.
                </p>
                <motion.button
                    onClick={goHome}
                    className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
                    whileHover={{ scale: 1.05 }}
                >
                    ← Volver al inicio
                </motion.button>
            </div>
        );
    }

    const p: any = property;

    return (
        <div className="container mx-auto max-w-6xl p-6 space-y-10">
            <ActionsBar title={p?.name ?? 'Propiedad'} onShare={share} />

            <motion.div {...fadeInUp} className="space-y-2 sm:space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-3">
                    {/* Titular + dirección */}
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight break-words">
                            {p?.name}
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 leading-snug line-clamp-2 sm:line-clamp-none break-words">
                            {p?.address}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-1 sm:gap-2 shrink-0">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-700">
                            {priceFormatted ?? '—'}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">Precio</span>
                    </div>
                </div>
            </motion.div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div {...fadeInUp} className="md:col-span-2">
                    <Gallery title={p?.name} images={galleryImages ?? []} />
                </motion.div>

                <motion.aside {...fadeInUp} className="space-y-4 md:col-span-1 md:sticky md:top-6">
                    {/* ✅ en vez de 'owner' in property */}
                    {p?.owner && <OwnerCard owner={p.owner} />}

                    <DetailsCard
                        beds={specs?.beds}
                        baths={specs?.baths}
                        areaM2={specs?.areaM2}
                        type={specs?.type}
                        year={specs?.year}
                        hoaCOP={specs?.hoaCOP}
                        formatCOP={formatCOP}
                    />

                    <MortgageCard
                        monthlyUSD={monthlyUSD}
                        formatUSD={formatUSD}
                        rateMonthly={mortgage?.rateMonthly}
                        years={mortgage?.years}
                        downPct={mortgage?.downPct}
                    />
                </motion.aside>
            </section>

            {Array.isArray(p?.traces) && p.traces.length > 0 && (
                <TracesTable traces={p.traces} formatCOP={formatCOP} />
            )}

            <Amenities items={amenities ?? []} />
            {mapAddress && <MapEmbed address={mapAddress} />}
            <CompanyContact fadeInUp={fadeInUp} />
        </div>
    );
}
