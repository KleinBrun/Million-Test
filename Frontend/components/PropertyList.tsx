import { PropertyListProps } from '@/types';
import PropertyCard from './PropertyCard';
import React from 'react';

export default function PropertyList({ properties }: PropertyListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
                <PropertyCard key={property.idProperty} property={property} />
            ))}
        </div>
    );
}
