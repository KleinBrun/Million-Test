import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProperties, getPropertyById } from '../propertyService';
import type { Property } from '@/types';

const mockFetch = global.fetch as any;

const mockProperties: Property[] = [
  {
    idProperty: '1',
    name: 'Casa Bonita',
    address: 'Calle 123 #45-67',
    price: 120000,
    codeInternal: 'C-001',
    year: 2020,
    images: [
      {
        idPropertyImage: 'img1',
        idProperty: '1',
        file: 'https://example.com/image1.jpg',
        enabled: true
      }
    ],
    traces: []
  },
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

const mockPropertyDetail: Property = {
  idProperty: '1',
  name: 'Casa Bonita',
  address: 'Calle 123 #45-67',
  price: 120000,
  codeInternal: 'C-001',
  year: 2020,
  owner: {
    idOwner: 'owner1',
    name: 'Juan Pérez',
    address: 'Calle 100 #50-25',
    photo: 'https://example.com/owner.jpg',
    birthday: '1985-05-15'
  },
  images: [
    {
      idPropertyImage: 'img1',
      idProperty: '1',
      file: 'https://example.com/image1.jpg',
      enabled: true
    }
  ],
  traces: [
    {
      idPropertyTrace: 'trace1',
      dateSale: '2020-01-15',
      name: 'Venta inicial',
      value: 100000,
      tax: 5000,
      idProperty: '1'
    }
  ]
};

describe('propertyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getProperties', () => {
    it('debería obtener propiedades sin filtros', async () => {
      const mockResponse = {
        data: mockProperties,
        totalCount: 2,
        totalPages: 1,
        page: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getProperties();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property?page=1&pageSize=10'
      );
      expect(result).toEqual(mockResponse);
    });

    it('debería obtener propiedades con filtros', async () => {
      const mockResponse = {
        data: [mockProperties[0]],
        totalCount: 1,
        totalPages: 1,
        page: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const filters = {
        name: 'Casa',
        address: 'Calle 123',
        minPrice: 100000,
        maxPrice: 150000,
        page: 2,
        pageSize: 5
      };

      const result = await getProperties(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property?name=Casa&address=Calle+123&minPrice=100000&maxPrice=150000&page=2&pageSize=5'
      );
      expect(result).toEqual(mockResponse);
    });

    it('debería manejar filtros parciales correctamente', async () => {
      const mockResponse = {
        data: mockProperties,
        totalCount: 2,
        totalPages: 1,
        page: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const filters = {
        name: 'Casa',
        minPrice: 100000
      };

      await getProperties(filters);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property?name=Casa&minPrice=100000&page=1&pageSize=10'
      );
    });

    it('debería lanzar error cuando la respuesta no es ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(getProperties()).rejects.toThrow('Error al obtener propiedades');
    });

    it('debería usar valores por defecto para page y pageSize', async () => {
      const mockResponse = {
        data: mockProperties,
        totalCount: 2,
        totalPages: 1,
        page: 1
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await getProperties({});

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property?page=1&pageSize=10'
      );
    });
  });

  describe('getPropertyById', () => {
    it('debería obtener una propiedad por ID exitosamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (header: string) =>
            header === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockPropertyDetail)
      });

      const result = await getPropertyById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property/1',
        { headers: { Accept: 'application/json' } }
      );
      expect(result).toEqual(mockPropertyDetail);
    });

    it('debería retornar null cuando la propiedad no existe (404)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await getPropertyById('999');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5228/api/Property/999',
        { headers: { Accept: 'application/json' } }
      );
      expect(result).toBeNull();
    });

    it('debería lanzar error cuando hay un error del servidor', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('Error interno del servidor')
      });

      await expect(getPropertyById('1')).rejects.toThrow(
        'HTTP 500 – Internal Server Error: Error interno del servidor'
      );
    });

    it('debería lanzar error cuando la respuesta no es JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (header: string) =>
            header === 'content-type' ? 'text/html' : null
        },
        text: () => Promise.resolve('<html>Not JSON</html>')
      });

      await expect(getPropertyById('1')).rejects.toThrow(
        'Respuesta no-JSON (Content-Type=text/html): <html>Not JSON</html>'
      );
    });

    it('debería manejar errores de red', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getPropertyById('1')).rejects.toThrow('Network error');
    });

    it('debería truncar el mensaje de error a 200 caracteres', async () => {
      const longError = 'A'.repeat(300);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve(longError)
      });

      await expect(getPropertyById('1')).rejects.toThrow(
        `HTTP 500 – Internal Server Error: ${'A'.repeat(200)}`
      );
    });
  });

  describe('ensureJsonResponse', () => {
    it('debería detectar content-type JSON correctamente', () => {
      const response = {
        headers: {
          get: (header: string) =>
            header === 'content-type' ? 'application/json' : null
        }
      } as Response;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (header: string) =>
            header === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockPropertyDetail)
      });

      expect(getPropertyById('1')).resolves.toEqual(mockPropertyDetail);
    });
  });
});
