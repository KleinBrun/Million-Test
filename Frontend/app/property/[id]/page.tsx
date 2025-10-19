'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { usePropertyStore } from '@/stores/propertyStore';

export default function PropertyDetailPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();

    const rehydrated = usePropertyStore((s) => s.rehydrated);
    const property = usePropertyStore((s) => s.getOne(id));
    const [notFound, setNotFound] = useState(false);

    // ⚙️ Esperamos a la rehidratación antes de decidir si no existe
    useEffect(() => {
        if (!rehydrated) return; // espera a que Zustand rehidrate desde localStorage
        if (!property) setNotFound(true);
    }, [rehydrated, property]);

    const priceFormatted = useMemo(() => {
        if (!property) return '';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(property.price);
    }, [property]);

    // ⏳ Mientras rehidrata, no mostramos nada
    if (!rehydrated) return null;

    // 🚫 Si no hay propiedad (ni en memoria ni persistida)
    if (notFound) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Propiedad no encontrada
                </h2>
                <p className="text-gray-500 mb-6">
                    La información de esta propiedad no está disponible.
                    Vuelve al inicio y selecciona una desde el listado.
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

    // ✅ Render normal si existe la propiedad
    return (
        <div className="container mx-auto p-6">
            <motion.button
                onClick={() => router.back()}
                className="mb-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                whileHover={{ scale: 1.05 }}
            >
                ← Volver
            </motion.button>

            <h1 className="text-4xl font-bold mb-6">{property?.name}</h1>

            <motion.img
                src={"../"+property?.image}
                alt={property?.name}
                className="w-full h-96 object-cover rounded-lg mb-6 bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (!el.src.includes('/images/fallback-property.jpg')) {
                        el.src = '/images/fallback-property.jpg';
                    }
                }}
            />

            <div className="space-y-4">
                <p className="text-lg">{property?.address}</p>
                <p className="text-xl text-green-600 font-bold">{priceFormatted}</p>
                {property?.description && (
                    <p className="text-gray-700">{property?.description}</p>
                )}
            </div>
        </div>
    );
}
