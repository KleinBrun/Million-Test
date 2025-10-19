import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Property } from '@/types/property';

interface PropertyState {
    properties: Property[];
    setMany: (props: Property[]) => void;
    getOne: (id: string) => Property | undefined;
    setOne: (prop: Property) => void;

    filters: {
        name: string;
        address: string;
        minPrice: string;
        maxPrice: string;
        currentPage: number;
    };
    setFilters: (filters: Partial<PropertyState['filters']>) => void;

    rehydrated: boolean;
}

export const usePropertyStore = create<PropertyState>()(
    persist(
        (set, get) => ({
            properties: [],
            setMany: (props) => set({ properties: props }),
            getOne: (id) => get().properties.find((p) => p.idProperty === id),
            setOne: (prop) =>
                set((state) => ({
                    properties: [
                        ...state.properties.filter((p) => p.idProperty !== prop.idProperty),
                        prop,
                    ],
                })),

            filters: {
                name: '',
                address: '',
                minPrice: '',
                maxPrice: '',
                currentPage: 1,
            },
            setFilters: (filters) =>
                set((state) => ({
                    filters: { ...state.filters, ...filters },
                })),

            rehydrated: false,
        }),
        {
            name: 'property-store',
            onRehydrateStorage: () => (state) => {
                if (state) state.rehydrated = true;
            },
        }
    )
);
