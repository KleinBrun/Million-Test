import { describe, it, expect, beforeEach } from 'vitest';
import { usePropertyStore } from '../propertyStore';
import type { Property } from '@/types';


describe('propertyStore', () => {
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
    vi.clearAllMocks();
  });

  describe('setMany', () => {
    it('debería establecer múltiples propiedades', () => {
      const { getState } = usePropertyStore;

      getState().setMany(mockProperties);

      expect(getState().properties).toEqual(mockProperties);
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

    it('debería retornar undefined si no hay propiedades', () => {
      const { getState } = usePropertyStore;

      const property = getState().getOne('1');

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

    it('debería mantener otras propiedades al actualizar una', () => {
      const { getState } = usePropertyStore;

      getState().setMany(mockProperties);
      expect(getState().properties).toHaveLength(2);

      const updatedProperty = { ...mockProperties[0], name: 'Casa Actualizada' };
      getState().setOne(updatedProperty);

      expect(getState().properties).toHaveLength(2);
      const propertyNames = getState().properties.map(p => p.name);
      expect(propertyNames).toContain('Casa Actualizada');
      expect(propertyNames).toContain('Apartamento Moderno');
    });
  });

  describe('setFilters', () => {
    it('debería actualizar filtros parcialmente', () => {
      const { getState } = usePropertyStore;

      getState().setFilters({ name: 'Casa' });

      expect(getState().filters.name).toBe('Casa');
      expect(getState().filters.address).toBe('');
      expect(getState().filters.minPrice).toBe('');
      expect(getState().filters.maxPrice).toBe('');
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

    it('debería mantener filtros existentes al actualizar parcialmente', () => {
      const { getState } = usePropertyStore;

      getState().setFilters({
        name: 'Casa',
        address: 'Bogotá',
        minPrice: '100000',
        maxPrice: '200000',
        currentPage: 1
      });

      getState().setFilters({ name: 'Apartamento', currentPage: 3 });

      expect(getState().filters).toEqual({
        name: 'Apartamento',
        address: 'Bogotá',
        minPrice: '100000',
        maxPrice: '200000',
        currentPage: 3
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

  describe('persistencia', () => {
    it('debería configurar persistencia correctamente', () => {
      const store = usePropertyStore.getState();

      expect(typeof store.setMany).toBe('function');
      expect(typeof store.getOne).toBe('function');
      expect(typeof store.setOne).toBe('function');
      expect(typeof store.setFilters).toBe('function');
    });
  });
});
