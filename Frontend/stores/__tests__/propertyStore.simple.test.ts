import { describe, it, expect, beforeEach } from 'vitest';
import { usePropertyStore } from '../propertyStore';
import type { Property } from '@/types';

describe('propertyStore - Simple Tests', () => {
  const mockProperty: Property = {
    idProperty: '1',
    name: 'Casa de Prueba',
    address: 'Calle 123 #45-67',
    price: 150000,
    codeInternal: 'C-001',
    year: 2020,
    images: [],
    traces: []
  };

  const mockProperties: Property[] = [
    mockProperty,
    {
      idProperty: '2',
      name: 'Apartamento Moderno',
      address: 'Avenida 45 #12-34',
      price: 250000,
      codeInternal: 'C-002',
      year: 2021,
      images: [],
      traces: []
    }
  ];

  beforeEach(() => {
    usePropertyStore.setState({
      properties: [],
      filters: {
        name: '',
        address: '',
        minPrice: '',
        maxPrice: '',
        currentPage: 1
      },
      rehydrated: false
    });
  });

  describe('setMany', () => {
    it('debería establecer múltiples propiedades', () => {
      const { getState } = usePropertyStore;

      getState().setMany(mockProperties);

      expect(getState().properties).toEqual(mockProperties);
      expect(getState().properties).toHaveLength(2);
    });

    it('debería reemplazar propiedades existentes', () => {
      const { getState } = usePropertyStore;

      getState().setMany([mockProperty]);
      expect(getState().properties).toHaveLength(1);

      getState().setMany(mockProperties);
      expect(getState().properties).toEqual(mockProperties);
      expect(getState().properties).toHaveLength(2);
    });
  });

  describe('getOne', () => {
    it('debería retornar una propiedad por ID', () => {
      const { getState } = usePropertyStore;

      getState().setMany(mockProperties);
      const property = getState().getOne('1');

      expect(property).toEqual(mockProperty);
    });

    it('debería retornar undefined si no encuentra la propiedad', () => {
      const { getState } = usePropertyStore;

      getState().setMany(mockProperties);
      const property = getState().getOne('999');

      expect(property).toBeUndefined();
    });
  });

  describe('setOne', () => {
    it('debería agregar una nueva propiedad', () => {
      const { getState } = usePropertyStore;

      getState().setOne(mockProperty);

      expect(getState().properties).toHaveLength(1);
      expect(getState().properties[0]).toEqual(mockProperty);
    });

    it('debería actualizar una propiedad existente', () => {
      const { getState } = usePropertyStore;

      getState().setOne(mockProperty);
      expect(getState().properties[0].name).toBe('Casa de Prueba');

      const updatedProperty = { ...mockProperty, name: 'Casa Actualizada' };
      getState().setOne(updatedProperty);

      expect(getState().properties).toHaveLength(1);
      expect(getState().properties[0].name).toBe('Casa Actualizada');
    });
  });

  describe('setFilters', () => {
    it('debería actualizar filtros parcialmente', () => {
      const { getState } = usePropertyStore;

      getState().setFilters({ name: 'Casa' });

      expect(getState().filters.name).toBe('Casa');
      expect(getState().filters.address).toBe('');
      expect(getState().filters.currentPage).toBe(1);
    });

    it('debería actualizar múltiples filtros', () => {
      const { getState } = usePropertyStore;

      getState().setFilters({
        name: 'Casa',
        address: 'Bogotá',
        minPrice: '100000',
        maxPrice: '200000',
        currentPage: 2
      });

      expect(getState().filters).toEqual({
        name: 'Casa',
        address: 'Bogotá',
        minPrice: '100000',
        maxPrice: '200000',
        currentPage: 2
      });
    });
  });

  describe('estado inicial', () => {
    it('debería tener estado inicial correcto', () => {
      const { getState } = usePropertyStore;

      expect(getState().properties).toEqual([]);
      expect(getState().filters).toEqual({
        name: '',
        address: '',
        minPrice: '',
        maxPrice: '',
        currentPage: 1
      });
      expect(getState().rehydrated).toBe(false);
    });
  });
});

