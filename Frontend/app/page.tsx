'use client';

import { useEffect, useState } from 'react';
import PropertyList from '../components/PropertyList';
import PropertyCardSkeleton from '../components/skeleton/PropertyCardSkeleton';
import { getProperties } from '../services/propertyService';
import { usePropertyStore } from '@/stores/propertyStore';
import Pagination from '@/components/Pagination';
import AnimatedPage from '@/components/AnimatedPage';
import { Property } from '@/types';
import FiltersToggle from '../components/FiltersToggle';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const [pageSize, setPageSize] = useState<number>(6);

  const filters = usePropertyStore((s) => s.filters);
  const setFilters = usePropertyStore((s) => s.setFilters);
  const setMany = usePropertyStore((s) => s.setMany);
  const rehydrated = usePropertyStore((s) => s.rehydrated);

  const { name, address, minPrice, maxPrice, currentPage } = filters;

  const fetchProperties = (page = 1, size = pageSize) => {
    setLoading(true);
    setError(null);
    getProperties({
      name: name || undefined,
      address: address || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page,
      pageSize: size,
    })
      .then((res) => {
        setProperties(res.data);
        setTotalPages(res.totalPages);
        setMany(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!rehydrated) return;
    fetchProperties(currentPage, pageSize);
  }, [rehydrated]);

  useEffect(() => {
    if (!rehydrated) return;
    fetchProperties(currentPage, pageSize);
  }, [currentPage]);

  useEffect(() => {
    if (!rehydrated) return;
    setFilters({ currentPage: 1 });
    fetchProperties(1, pageSize);
  }, [pageSize]);

  const applyFilters = () => {
    setFilters({ currentPage: 1 });
    fetchProperties(1, pageSize);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      address: '',
      minPrice: '',
      maxPrice: '',
      currentPage: 1,
    });
    getProperties({ page: 1, pageSize })
      .then((res) => {
        setProperties(res.data);
        setTotalPages(res.totalPages);
        setMany(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

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
        <p className="text-2xl font-semibold text-red-600 mb-2">Error al cargar propiedades</p>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
        >
          Recargar
        </button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Propiedades en Venta</h1>
        <div className="sticky top-4 z-20">
          <FiltersToggle
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
        </div>
      </div>

      {properties.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No se encontraron propiedades.</p>
      ) : (
        <>
          <AnimatedPage pageKey={currentPage} variant="slide">
            <PropertyList properties={properties} />
          </AnimatedPage>

          <Pagination
            className="mt-10"
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(p) => setFilters({ currentPage: p })}
            showInfo
            pageSize={pageSize}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setFilters({ currentPage: 1 });
              fetchProperties(1, n);
            }}
          />
        </>
      )}
    </main>
  );
}
