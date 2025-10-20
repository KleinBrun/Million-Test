'use client';

import AnimatedPage from '@/components/AnimatedPage';
import FiltersToggle from '@/components/FiltersToggle';
import Pagination from '@/components/Pagination';
import PropertyList from '@/components/PropertyList';
import PropertyCardSkeleton from '@/components/skeleton/PropertyCardSkeleton';
import { usePropertySearch } from '@/hooks/usePropertySearch';

export default function Home() {
  const { properties, loading, error, totalPages, currentPage, pageSize,
    setPageSize, name, address, minPrice, maxPrice, setName, setAddress,
    setMinPrice, setMaxPrice, setPage, applyFilters, clearFilters, } = usePropertySearch(6);

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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
          Propiedades en Venta
        </h1>
        <div className="sticky top-4 z-20">
          <FiltersToggle
            name={name}
            setName={setName}
            address={address}
            setAddress={setAddress}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
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
            onChange={setPage}
            showInfo
            pageSize={pageSize}
            onPageSizeChange={(n) => {
              setPageSize(n);
              setPage(1);
            }}
          />
        </>
      )}
    </main>
  );
}
