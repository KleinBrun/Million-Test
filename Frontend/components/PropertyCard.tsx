'use client';

import Link from 'next/link';
import { Property } from '@/types/property';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePropertyStore } from '@/stores/propertyStore';

interface CardProps {
    property: Property;
}

export default function PropertyCard({ property }: CardProps) {
    const router = useRouter();
    const setOne = usePropertyStore((s) => s.setOne);

    const goDetail = () => {
        setOne(property); // cachea en Zustand
        router.push(`/property/${property.idProperty}`);
    };

    // ✅ Usa la primera imagen si existe, o un placeholder
    const imageUrl =
        property.images && property.images.length > 0
            ? property.images[0].file
            : 'https://placehold.co/600x400?text=Sin+Imagen';

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer relative group border border-gray-200"
            whileHover={{ scale: 1.05 }}
            onClick={goDetail}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goDetail()}
        >
            {/* Link solo para prefetch del href */}
            <Link href={`/property/${property.idProperty}`} prefetch className="block">
                <motion.img
                    src={imageUrl}
                    alt={property.name}
                    className="w-full h-64 object-cover transition-transform duration-500"
                    whileHover={{ scale: 1.1 }}
                />
                <div className="p-4">
                    <h2 className="text-2xl font-bold mb-1">{property.name}</h2>
                    <p className="text-gray-600 mb-1">{property.address}</p>
                    <p className="text-green-600 font-semibold">
                        ${property.price.toLocaleString('es-CO')}
                    </p>
                </div>
            </Link>

            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white font-bold text-lg tracking-wider">
                    Ver más
                </span>
            </div>
        </motion.div>
    );
}
