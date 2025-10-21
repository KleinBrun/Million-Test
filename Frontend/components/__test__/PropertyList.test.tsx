import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyList from '../PropertyList';
import { Property } from '@/types';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../PropertyCard', () => ({
    default: ({ property }: { property: Property }) => (
        <div data-testid="property-card">{property.name}</div>
    ),
}));

describe('PropertyList', () => {
    it('renderiza todas las propiedades', () => {
        const properties: Property[] = [
            {
                idProperty: '1',
                name: 'Casa en Bogotá',
                address: 'Calle 123',
                price: 250000000,
                codeInternal: 'C001',
                year: 2020,
                images: [],
                traces: [],
            },
            {
                idProperty: '2',
                name: 'Apartamento en Medellín',
                address: 'Carrera 45',
                price: 180000000,
                codeInternal: 'A002',
                year: 2018,
                images: [],
                traces: [],
            },
        ];

        render(<PropertyList properties={properties} />);

        const cards = screen.getAllByTestId('property-card');
        expect(cards).toHaveLength(properties.length);

        expect(screen.getByText('Casa en Bogotá')).toBeInTheDocument();
        expect(screen.getByText('Apartamento en Medellín')).toBeInTheDocument();
    });
});
