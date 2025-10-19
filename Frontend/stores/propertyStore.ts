'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Property } from '@/types/property';

type State = {
    byId: Record<string, Property>;
    // acciones
    setOne: (p: Property) => void;
    getOne: (id: string) => Property | undefined;
    setMany: (list: Property[]) => void;
    clear: () => void;
    // hidratación de persistencia
    rehydrated: boolean;
    setRehydrated: (v: boolean) => void;
};

export const usePropertyStore = create<State>()(
    persist(
        (set, get) => ({
            byId: {},
            setOne: (p) => set((s) => ({ byId: { ...s.byId, [p.id]: p } })),
            getOne: (id) => get().byId[id],
            setMany: (list) =>
                set((s) => ({
                    byId: { ...s.byId, ...Object.fromEntries(list.map((p) => [p.id, p])) },
                })),
            clear: () => set({ byId: {} }),
            rehydrated: false,
            setRehydrated: (v) => set({ rehydrated: v }),
        }),
        {
            name: 'property-cache-v1', // clave en localStorage
            storage: createJSONStorage(() => localStorage),
            // Solo persistimos el mapa (no funciones ni flags)
            partialize: (s) => ({ byId: s.byId }),
            // Marca cuando terminó de rehidratar
            onRehydrateStorage: () => (state, error) => {
                if (!error) state?.setRehydrated(true);
            },
        }
    )
);
