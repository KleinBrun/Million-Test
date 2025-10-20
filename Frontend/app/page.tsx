'use client';

import { motion } from 'framer-motion';
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
        <div className="bg-red-100 text-red-600 p-5 rounded-full mb-6 shadow-md animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Error al cargar propiedades
        </h2>

        <p className="text-gray-500 mb-6 max-w-md">
          Ocurrió un problema al obtener la información.
          Puedes intentar recargar la página para volver a intentarlo.
        </p>

        <motion.button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-lg hover:from-gray-700 hover:to-gray-600 shadow-md transition"
          whileHover={{ scale: 1.05 }}
        >Recargar página
        </motion.button>
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
