'use client';

import { useEffect, useState } from 'react';
import PropertyList from '../components/PropertyList';
import PropertyCardSkeleton from '../components/skeleton/PropertyCardSkeleton';
import PropertyFilters from '../components/PropertyFilters';
import { getProperties } from '../services/propertyService';
import { Property } from '../types/property';
import { motion } from 'framer-motion';
import { usePropertyStore } from '@/stores/propertyStore';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  // ✅ Traer filtros y paginación persistentes desde Zustand
  const filters = usePropertyStore((s) => s.filters);
  const setFilters = usePropertyStore((s) => s.setFilters);
  const setMany = usePropertyStore((s) => s.setMany);
  const rehydrated = usePropertyStore((s) => s.rehydrated);

  const { name, address, minPrice, maxPrice, currentPage } = filters;

  // 🧠 Función centralizada de carga
  const fetchProperties = (page = 1) => {
    setLoading(true);
    setError(null);

    getProperties({
      name: name || undefined,
      address: address || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page,
      pageSize,
    })
      .then((res) => {
        setProperties(res.data);
        setTotalPages(res.totalPages);
        setMany(res.data); // cache global
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // 🔁 Cargar propiedades al montar o al rehidratar el store
  useEffect(() => {
    if (!rehydrated) return;
    fetchProperties(currentPage);
  }, [rehydrated]);

  // 🔁 Cargar propiedades si cambian filtros o página
  useEffect(() => {
    if (!rehydrated) return;
    fetchProperties(currentPage);
  }, [currentPage, name, address, minPrice, maxPrice]);

  // 🎛 Aplicar filtros
  const applyFilters = () => {
    setFilters({ currentPage: 1 });
    fetchProperties(1);
  };

  // 🧹 Limpiar filtros
  const clearFilters = () => {
    setFilters({
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
      currentPage: 1,
    });
    fetchProperties(1);
  };

  // --- Render principal ---
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: pageSize }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-6">
        <p className="text-2xl font-semibold text-red-600 mb-2">
          Error al cargar propiedades
        </p>
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

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Propiedades en Venta</h1>

      <PropertyFilters
        name={name}
        setName={(v) => setFilters({ name: v })}
        address={address}
        setAddress={(v) => setFilters({ address: v })}
        minPrice={minPrice}
        setMinPrice={(v) => setFilters({ minPrice: v })}
        maxPrice={maxPrice}
        setMaxPrice={(v) => setFilters({ maxPrice: v })}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      {properties.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No se encontraron propiedades.
        </p>
      ) : (
        <>
          <PropertyList properties={properties} />

          {/* Barra de paginación */}
          <div className="flex justify-center items-center mt-10 gap-2">
            <motion.button
              disabled={currentPage === 1}
              onClick={() => setFilters({ currentPage: Math.max(currentPage - 1, 1) })}
              className={`px-4 py-2 rounded border ${currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
            >
              ← Anterior
            </motion.button>

            <span className="text-gray-700 text-sm">
              Página {currentPage} de {totalPages}
            </span>

            <motion.button
              disabled={currentPage === totalPages}
              onClick={() => setFilters({ currentPage: Math.min(currentPage + 1, totalPages) })}
              className={`px-4 py-2 rounded border ${currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
            >
              Siguiente →
            </motion.button>
          </div>
        </>
      )}
    </main>
  );
}
