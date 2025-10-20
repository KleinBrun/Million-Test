import { PropertyState } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePropertyStore = create<PropertyState>()(
    persist(
        (set, get) => ({
            properties: [],
            setMany: (props) => set({ properties: props }),
            getOne: (id) => get().properties.find((p) => p.idProperty === id),
            setOne: (prop) =>
                set((state) => ({
                    properties: [
                        ...state.properties.filter((p) => p.idProperty !== prop.idProperty), prop,
                    ],
                })),

            filters: {
                name: '',
                address: '',
                minPrice: '',
                maxPrice: '',
                currentPage: 1,
            },
            setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters }, })),

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
