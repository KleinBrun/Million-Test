'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePropertyStore } from '@/stores/propertyStore';

export default function PropertyDetailPage() {
    // -------- Router & Params --------
    const { id } = useParams() as { id: string };
    const router = useRouter();

    // -------- Global State (Zustand) --------
    const rehydrated = usePropertyStore((s) => s.rehydrated);
    const property = usePropertyStore((s) => s.getOne(id));

    // -------- Local State --------
    const [notFound, setNotFound] = useState(false);
    const [activeImg, setActiveImg] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);

    // -------- Effects --------
    useEffect(() => {
        console.log('🚀🕸 ~ property:', id)
        if (!rehydrated) return;
        setNotFound(!property);
    }, [rehydrated, property]);

    // -------- Helpers --------
    const formatCOP = (n?: number) =>
        n == null
            ? ''
            : new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0,
            }).format(n);

    const formatUSD = (n?: number) =>
        n == null
            ? ''
            : new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
            }).format(n);

    const priceFormatted = useMemo(() => formatUSD(property?.price), [property?.price]);

    // 🎯 Galería real
    const gallery = useMemo(() => {
        const imgs = (property?.images ?? [])
            .filter((img) => img?.enabled && !!img?.file)
            .map((img) => img.file);
        return imgs.length > 0 ? imgs : ['SIN_IMAGEN'];
    }, [property]);
    const totalImages = gallery.length;

    const goNext = () => setActiveImg((i) => (i + 1) % totalImages);
    const goPrev = () => setActiveImg((i) => (i - 1 + totalImages) % totalImages);
    const goIndex = (idx: number) => setActiveImg(idx % totalImages);

    // Autoplay si hay varias imágenes
    useEffect(() => {
        if (notFound || totalImages <= 1) return;
        if (isHovered) return;
        const t = setInterval(goNext, 3500);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isHovered, totalImages]);

    // Navegación con teclado
    useEffect(() => {
        const el = galleryRef.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, [totalImages]);

    // -------- Mock / Extras --------
    const specs = useMemo(
        () => ({ beds: 3, baths: 2, areaM2: 128, type: 'Apartamento', year: property?.year ?? 2021, hoaCOP: 380_000 }),
        [property?.year]
    );

    const amenities = useMemo(
        () => ['Parqueadero', 'Gimnasio', 'Piscina', 'Vigilancia 24/7', 'Ascensor', 'Zona BBQ', 'Coworking'],
        []
    );

    const mortgage = useMemo(() => ({ rateMonthly: 0.0125, years: 20, downPct: 0.2 }), []);
    const monthly = useMemo(() => {
        if (!property?.price) return null;
        const P = property.price * (1 - mortgage.downPct);
        const i = mortgage.rateMonthly;
        const n = mortgage.years * 12;
        const cuota = (P * i) / (1 - Math.pow(1 + i, -n));
        return Math.round(cuota);
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
            if (property?.idProperty) await navigator.clipboard.writeText(property.idProperty);
        } catch { }
    };

    // -------- Animaciones --------
    const fadeInUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };
    const pop = { whileHover: { scale: 1.03 }, transition: { duration: 0.2 } };

    // -------- Conditional Renders --------
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

    // -------- UI --------
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Breadcrumb + acciones */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <nav className="text-sm text-gray-500" aria-label="breadcrumb">
                    <button onClick={() => router.push('/')} className="underline underline-offset-2 hover:text-gray-800">
                        Inicio
                    </button>{' '}
                    / <span className="text-gray-800 font-medium">{property?.name}</span>
                </nav>

                <div className="flex gap-2">
                    <motion.button
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        {...pop}
                        onClick={share}
                        aria-label="Compartir"
                    >
                        Compartir
                    </motion.button>
                    <motion.button
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                        {...pop}
                        onClick={copyId}
                        title="Copiar ID"
                    >
                        Copiar ID
                    </motion.button>
                    <motion.button onClick={() => router.back()} className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800" {...pop}>
                        ← Volver
                    </motion.button>
                </div>
            </div>

            {/* Título + dirección + precio */}
            <motion.div {...fadeInUp} className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-bold">{property?.name}</h1>
                <p className="text-gray-600">{property?.address}</p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl md:text-4xl font-extrabold text-green-700">{priceFormatted}</span>
                    <span className="text-sm text-gray-500">Precio</span>
                </div>
            </motion.div>

            {/* Galería */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    {...fadeInUp}
                    className="md:col-span-2"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div
                        ref={galleryRef}
                        className="relative rounded-2xl overflow-hidden bg-gray-100 outline-none"
                        tabIndex={0}
                        aria-roledescription="carrusel"
                    >
                        <AnimatePresence mode="wait">
                            {gallery[activeImg] === 'SIN_IMAGEN' ? (
                                <div className="w-full h-[420px] md:h-[520px] flex items-center justify-center text-gray-500 text-lg font-medium">
                                    Sin imagen
                                </div>
                            ) : (
                                <motion.img
                                    key={activeImg}
                                    src={gallery[activeImg]}
                                    alt={`${property?.name} imagen ${activeImg + 1}`}
                                    className="w-full h-[420px] md:h-[520px] object-cover"
                                    initial={{ opacity: 0, scale: 1.02 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Controles solo si hay >1 */}
                        {totalImages > 1 && (
                            <>
                                <motion.button
                                    type="button"
                                    onClick={goPrev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
                                    {...pop}
                                >
                                    ‹
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={goNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/60"
                                    {...pop}
                                >
                                    ›
                                </motion.button>
                            </>
                        )}
                    </div>
                </motion.div>

                {/* Panel lateral */}
                <motion.aside {...fadeInUp} className="space-y-4 md:col-span-1">
                    {/* Propietario */}
                    {property?.owner && (
                        <div className="rounded-2xl border p-5 bg-white flex gap-4 items-center">
                            <img
                                src={property.owner.photo ?? 'https://placehold.co/80x80?text=👤'}
                                alt={property.owner.name}
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                            <div>
                                <h3 className="font-semibold">{property.owner.name}</h3>
                                <p className="text-sm text-gray-600">{property.owner.address}</p>
                            </div>
                        </div>
                    )}

                    {/* Detalles y hipoteca */}
                    <div className="rounded-2xl border p-5 bg-white">
                        <h3 className="font-semibold mb-3">Detalles principales</h3>
                        <ul className="grid grid-cols-2 gap-3 text-sm">
                            <li>Habitaciones: {specs.beds}</li>
                            <li>Baños: {specs.baths}</li>
                            <li>Área: {specs.areaM2} m²</li>
                            <li>Tipo: {specs.type}</li>
                            <li>Año: {specs.year}</li>
                            <li>Adm. (HOA): {formatCOP(specs.hoaCOP)}</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border p-5 bg-white">
                        <h3 className="font-semibold mb-3">Estimar hipoteca</h3>
                        <p className="text-sm text-gray-600">
                            Cuota mensual aprox: <span className="font-semibold text-gray-900">{monthly ? formatUSD(monthly) : '—'}</span>
                        </p>
                    </div>
                </motion.aside>
            </section>

            {/* Historial de ventas */}
            {property?.traces && property.traces.length > 0 && (
                <motion.section {...fadeInUp} className="rounded-2xl border p-5 bg-white">
                    <h3 className="font-semibold mb-3">Historial de ventas</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2 border">Fecha</th>
                                    <th className="p-2 border">Nombre</th>
                                    <th className="p-2 border">Valor</th>
                                    <th className="p-2 border">Impuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {property.traces.map((t) => (
                                    <tr key={t.idPropertyTrace}>
                                        <td className="p-2 border">{new Date(t.dateSale).toLocaleDateString()}</td>
                                        <td className="p-2 border">{t.name}</td>
                                        <td className="p-2 border">{formatCOP(t.value)}</td>
                                        <td className="p-2 border">{formatCOP(t.tax)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            )}

            {/* Amenidades */}
            <motion.section {...fadeInUp} className="rounded-2xl border p-5 bg-white">
                <h3 className="font-semibold mb-3">Amenidades</h3>
                <div className="flex flex-wrap gap-2">
                    {amenities.map((a) => (
                        <motion.span key={a} className="px-3 py-1.5 rounded-full bg-gray-100 border text-sm text-gray-700" whileHover={{ scale: 1.06 }}>
                            {a}
                        </motion.span>
                    ))}
                </div>
            </motion.section>

            {/* Mapa */}
            <motion.section {...fadeInUp} className="rounded-2xl border p-5 bg-white">
                <h3 className="font-semibold mb-2">Ubicación</h3>
                <p className="text-sm text-gray-600 mb-3">{mapAddress}</p>
                <div className="aspect-video w-full rounded-xl overflow-hidden border">
                    <iframe
                        title="Mapa de ubicación"
                        className="w-full h-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&z=15&output=embed`}
                    />
                </div>
            </motion.section>
        </div>
    );
}
