'use client';

import { FilterFormProps } from '@/types';
import { useState } from 'react';

export default function FilterForm({ onFilter }: FilterFormProps) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilter({
            name: name || undefined,
            address: address || undefined,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 bg-white rounded shadow flex flex-col md:flex-row gap-4 items-end"
        >
            <div className="flex-1">
                <label className="block text-gray-700 mb-1">Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Nombre propiedad"
                />
            </div>

            <div className="flex-1">
                <label className="block text-gray-700 mb-1">Dirección</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Dirección"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Precio mínimo</label>
                <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-32 border rounded p-2"
                    placeholder="0"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Precio máximo</label>
                <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-32 border rounded p-2"
                    placeholder="1000000000"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Filtrar
            </button>
        </form>
    );
}
