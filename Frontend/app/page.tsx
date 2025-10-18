'use client';

import { useEffect, useState } from 'react';
import PropertyList from '../components/PropertyList';
import { getProperties } from '../services/propertyService';
import { Property } from '../types/property';
import PropertyCardSkeleton from '../components/skeleton/PropertyCardSkeleton';
import PropertyFilters from '../components/PropertyFilters';
import { motion } from 'framer-motion';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data);
      setFilteredProperties(data);
      setLoading(false);
    });
  }, []);

  // Filtrado en tiempo real
  useEffect(() => {
    const min = minPrice ? parseFloat(minPrice) * 1_000_000 : 0;
    const max = maxPrice ? parseFloat(maxPrice) * 1_000_000 : Infinity;

    const filtered = properties.filter((p) => {
      return (
        p.name.toLowerCase().includes(name.toLowerCase()) &&
        p.address.toLowerCase().includes(address.toLowerCase()) &&
        p.price >= min &&
        p.price <= max
      );
    });

    setFilteredProperties(filtered);
  }, [name, address, minPrice, maxPrice, properties]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          No se encontraron propiedades
        </p>
        <motion.button
          onClick={() => window.location.reload()}
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Recargar
        </motion.button>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Propiedades en Venta</h1>

      {/* Filtros */}
      <PropertyFilters
        name={name}
        setName={setName}
        address={address}
        setAddress={setAddress}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {/* Lista de propiedades */}
      <PropertyList properties={filteredProperties} />
    </main>
  );
}
