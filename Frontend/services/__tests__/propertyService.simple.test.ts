import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProperties, getPropertyById } from '../propertyService';

// Mock de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('propertyService - Simple Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProperties', () => {
    it('debería construir URL correctamente sin filtros', async () => {
      const mockResponse = {
        data: [],
        totalCount: 0,
        totalPages: 1,
        page: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await getProperties();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property?page=1&pageSize=10'
      );
    });

    it('debería construir URL correctamente con filtros', async () => {
      const mockResponse = {
        data: [],
        totalCount: 0,
        totalPages: 1,
        page: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const filters = {
        name: 'Casa',
        address: 'Bogotá',
        minPrice: 100000,
        maxPrice: 200000,
        page: 2,
        pageSize: 5
      };

      await getProperties(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property?name=Casa&address=Bogot%C3%A1&minPrice=100000&maxPrice=200000&page=2&pageSize=5'
      );
    });

    it('debería retornar datos cuando la respuesta es exitosa', async () => {
      const mockResponse = {
        data: [{ idProperty: '1', name: 'Test Property' }],
        totalCount: 1,
        totalPages: 1,
        page: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getProperties();

      expect(result).toEqual(mockResponse);
    });

    it('debería lanzar error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(getProperties()).rejects.toThrow('Error al obtener propiedades');
    });
  });

  describe('getPropertyById', () => {
    it('debería construir URL correctamente', async () => {
      const mockResponse = { idProperty: '1', name: 'Test Property' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (header: string) =>
            header === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockResponse)
      });

      await getPropertyById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property/1',
        { headers: { Accept: 'application/json' } }
      );
    });

    it('debería retornar null para 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await getPropertyById('999');

      expect(result).toBeNull();
    });

    it('debería retornar datos cuando la respuesta es exitosa', async () => {
      const mockResponse = { idProperty: '1', name: 'Test Property' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (header: string) =>
            header === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getPropertyById('1');

      expect(result).toEqual(mockResponse);
    });

    it('debería lanzar error para otros códigos de estado', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Error interno')
      });

      await expect(getPropertyById('1')).rejects.toThrow(
        'HTTP 500 – Internal Server Error: Error interno'
      );
    });
  });
});
