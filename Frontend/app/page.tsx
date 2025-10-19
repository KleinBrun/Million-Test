'use client';

import { useEffect, useMemo, useState } from 'react';
import PropertyList from '../components/PropertyList';
import { getProperties } from '../services/propertyService';
import { Property } from '../types/property';
import PropertyCardSkeleton from '../components/skeleton/PropertyCardSkeleton';
import PropertyFilters from '../components/PropertyFilters';
import { motion } from 'framer-motion';
import { usePropertyStore } from '@/stores/propertyStore';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filtros
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // precarga en cache (Zustand) para el detalle
  const setMany = usePropertyStore((s) => s.setMany);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    getProperties()
      .then((data) => {
        if (!alive) return;
        setProperties(data);
        // precargar cache para navegación sin refetch
        setMany(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [setMany]);

  // filtrado memoizado
  const filteredProperties = useMemo(() => {
    const min = minPrice ? Number(minPrice) * 1_000_000 : 0;
    const max = maxPrice ? Number(maxPrice) * 1_000_000 : Infinity;

    return properties.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase()) &&
      p.address.toLowerCase().includes(address.toLowerCase()) &&
      p.price >= min &&
      p.price <= max
    );
  }, [name, address, minPrice, maxPrice, properties]);

  // loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // error de red/servidor
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <p className="text-2xl font-semibold text-red-600 mb-2">Propiedades no encontradas</p>
        <p className="text-gray-600 mb-6">{error}</p>
        <motion.button
          onClick={() => window.location.reload()}
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
          whileHover={{ scale: 1.05 }}
        >
          Recargar
        </motion.button>
      </div>
    );
  }

  // sin datos desde API
  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          No se encontraron propiedades
        </p>
        <motion.button
          onClick={() => window.location.reload()}
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
          whileHover={{ scale: 1.05 }}
        >
          Recargar
        </motion.button>
      </div>
    );
  }

  // sin resultados por filtros
  if (filteredProperties.length === 0) {
    return (
      <main className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Propiedades en Venta</h1>

        <PropertyFilters
          name={name} setName={setName}
          address={address} setAddress={setAddress}
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        />

        <div className="mt-10 flex flex-col items-center">
          <p className="text-lg text-gray-700 mb-4">
            No hay resultados con los filtros aplicados.
          </p>
          <div className="flex gap-3">
            <motion.button
              onClick={() => { setName(''); setAddress(''); setMinPrice(''); setMaxPrice(''); }}
              className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-700 transition"
              whileHover={{ scale: 1.05 }}
            >
              Limpiar filtros
            </motion.button>
            <motion.button
              onClick={() => window.location.reload()}
              className="bg-gray-200 text-gray-900 px-5 py-2 rounded hover:bg-gray-300 transition"
              whileHover={{ scale: 1.05 }}
            >
              Recargar
            </motion.button>
          </div>
        </div>
      </main>
    );
  }

  // lista con resultados
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Propiedades en Venta</h1>

      <PropertyFilters
        name={name} setName={setName}
        address={address} setAddress={setAddress}
        minPrice={minPrice} setMinPrice={setMinPrice}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
      />

      <PropertyList properties={filteredProperties} />
    </main>
  );
}
