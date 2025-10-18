'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProperties } from '@/services/propertyService';
import PropertyDetailSkeleton from '@/components/skeleton/PropertyDetailSkeleton';
import { Property } from '@/types/property';

export default function PropertyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProperties().then((data) => {
            const found = data.find((p) => p.idOwner === id);
            setProperty(found || null);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <PropertyDetailSkeleton />;

    if (!property) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <p className="text-2xl font-semibold text-gray-700 mb-4">
                    Propiedad no encontrada
                </p>
                <motion.button
                    onClick={() => router.back()}
                    className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                >
                    ← Volver
                </motion.button>
            </div>
        );
    }

    // Aquí va tu render de detalle normal
    return (
        <div className="container mx-auto p-6">
            <motion.button
                onClick={() => router.back()}
                className="mb-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
            >
                ← Volver
            </motion.button>

            <h1 className="text-4xl font-bold mb-6">{property.name}</h1>
            <motion.img
                src={property.image}
                alt={property.name}
                className="w-full h-96 object-cover rounded-lg mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />
            <div className="space-y-4">
                <p className="text-lg">{property.address}</p>
                <p className="text-xl text-green-600 font-bold">
                    ${property.price.toLocaleString()}
                </p>
                <p className="text-gray-700">{property.description}</p>
            </div>
        </div>
    );
}
