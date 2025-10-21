process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:5228/api/Property';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProperties, getPropertyById } from '../propertyService';
import type { Property } from '@/types';

const sampleList = [
  { idProperty: '1', name: 'Casa', address: 'Calle 1', price: 100, codeInternal: 'C1', year: 2020, images: [], traces: [] },
  { idProperty: '2', name: 'Apto', address: 'Calle 2', price: 200, codeInternal: 'C2', year: 2021, images: [], traces: [] },
] as Property[];

const sampleDetail = { idProperty: '1', name: 'Casa', address: 'Calle 1', price: 100, codeInternal: 'C1', year: 2020, images: [], traces: [] } as Property;

describe('propertyService (robust)', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('getProperties: sin filtros -> devuelve lista y agrega page/pageSize', async () => {
    const apiResp = { data: sampleList, totalCount: 2, totalPages: 1, page: 1 };
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiResp) });

    const res = await getProperties();

    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain('page=1');
    expect(calledUrl).toContain('pageSize=10');

    expect(res).toEqual(apiResp);
  });

  it('getProperties: aplica filtros -> construye query string con los filtros', async () => {
    const apiResp = { data: [sampleList[0]], totalCount: 1, totalPages: 1, page: 2 };
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(apiResp) });

    const filters = { name: 'Casa', address: 'Calle 1', minPrice: 50, maxPrice: 150, page: 2, pageSize: 5 };
    await getProperties(filters);

    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain('name=Casa');
    expect(calledUrl).toContain('address=Calle+1');
    expect(calledUrl).toContain('minPrice=50');
    expect(calledUrl).toContain('maxPrice=150');
    expect(calledUrl).toContain('page=2');
    expect(calledUrl).toContain('pageSize=5');
  });

  it('getPropertyById: llama por id con headers Accept y devuelve detalle', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (h: string) => (h === 'content-type' ? 'application/json' : null) },
      json: () => Promise.resolve(sampleDetail),
    });

    const res = await getPropertyById('1');

    const calledUrl = String(fetchMock.mock.calls[0][0]);
    expect(calledUrl).toContain('/1');
    expect(fetchMock.mock.calls[0][1]).toEqual({ headers: { Accept: 'application/json' } });

    expect(res).toEqual(sampleDetail);
  });

  it('getPropertyById: 404 -> null y 500 -> trunca mensaje', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found' });
    const r404 = await getPropertyById('999');
    expect(r404).toBeNull();

    const longMsg = 'A'.repeat(300);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve(longMsg),
    });

    await expect(getPropertyById('1')).rejects.toThrow(`HTTP 500 – Internal Server Error: ${'A'.repeat(200)}`);
  });
});
