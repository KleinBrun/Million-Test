'use client';

import { motion } from 'framer-motion';

interface FiltersProps {
    name: string;
    setName: (value: string) => void;
    address: string;
    setAddress: (value: string) => void;
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
}

export default function PropertyFilters({ name, setName, address, setAddress, minPrice, setMinPrice, maxPrice, setMaxPrice, onApply, onClear, }: FiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-md flex-wrap items-end">
            <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full sm:flex-1 focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="text"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full sm:flex-1 focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="number"
                placeholder="Precio mín"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full sm:w-36 focus:ring-2 focus:ring-blue-400"
            />
            <input
                type="number"
                placeholder="Precio máx"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full sm:w-36 focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex gap-2 w-full sm:w-auto">
                <motion.button
                    onClick={onApply}
                    className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-700 transition w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                >
                    Aplicar
                </motion.button>
                <motion.button
                    onClick={onClear}
                    className="bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300 transition w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                >
                    Limpiar
                </motion.button>
            </div>
        </div>
    );
}
