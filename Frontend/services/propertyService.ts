import { Property } from '../types/property';

interface Filters {
    name?: string;
    address?: string;
    minPrice?: number;
    maxPrice?: number;
}

export async function getProperties(filters?: Filters): Promise<Property[]> {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const url = `http://localhost:5228/Properties?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error al obtener propiedades: ${response.statusText}`);
    return response.json();
}

/** 🔹 Nueva función: obtener una propiedad por id */
export async function getPropertyById(id: string): Promise<Property | null> {
    const url = `http://localhost:5228/Properties/${id}`;
    const response = await fetch(url);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Error al obtener propiedad: ${response.statusText}`);
    return response.json();
}
