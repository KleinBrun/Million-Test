const BASE_URL = 'http://localhost:5228/api/Property';

function ensureJsonResponse(response: Response) {
    const ct = response.headers.get('content-type') || '';
    return ct.includes('application/json');
}

export async function getProperties(filters?: { name?: string; address?: string; minPrice?: number; maxPrice?: number; page?: number; pageSize?: number; }): Promise<{ data: any[]; totalCount: number; totalPages: number; page: number; }> {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    params.append('page', String(filters?.page ?? 1));
    params.append('pageSize', String(filters?.pageSize ?? 10));

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Error al obtener propiedades');
    return response.json();
}


export async function getPropertyById(id: string): Promise<any | null> {
    const url = `${BASE_URL}/${id}`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    if (response.status === 404) return null;
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status} – ${response.statusText}: ${text.slice(0, 200)}`);
    }

    if (!ensureJsonResponse(response)) {
        const body = await response.text();
        throw new Error(`Respuesta no-JSON (Content-Type=${response.headers.get('content-type')}): ${body.slice(0, 200)}`);
    }

    return response.json();
}
