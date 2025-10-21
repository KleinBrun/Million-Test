import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import type { FiltersPayload } from '@/types';

if (!(globalThis as any).React) {
    (globalThis as any).React = React;
}


vi.mock('framer-motion', () => {
    const ReactLocal = require('react');
    const MotionMock = ReactLocal.forwardRef((props: any, ref: any) =>
        ReactLocal.createElement('div', { ...props, ref }, props.children)
    );
    return {
        __esModule: true,
        motion: { div: MotionMock, img: MotionMock },
        AnimatePresence: ({ children }: any) => ReactLocal.createElement(ReactLocal.Fragment, null, children),
        default: {},
    };
});

vi.mock('@/utils/format', () => ({
    copToMM: (v: any) => String(v ?? ''),
    mmToCOP: (v: any) => String(v ?? ''),
}));

import FiltersToggle from '@/components/FiltersToggle';

function setMatchMedia(matches: boolean) {
    Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        writable: true,
        value: (query: string) => {
            return {
                matches,
                media: query,
                addEventListener: (_: string, __: any) => { },
                removeEventListener: (_: string, __: any) => { },
                onchange: null,
                dispatchEvent: () => false,
            } as unknown as MediaQueryList;
        },
    });
}

describe('FiltersToggle', () => {
    let setName: ReturnType<typeof vi.fn>;
    let setAddress: ReturnType<typeof vi.fn>;
    let setMinPrice: ReturnType<typeof vi.fn>;
    let setMaxPrice: ReturnType<typeof vi.fn>;

    let onApplySpy: ReturnType<typeof vi.fn>;
    let onClearSpy: ReturnType<typeof vi.fn>;

    let onApply: (p: FiltersPayload) => void;
    let onClear: (p?: FiltersPayload) => void;

    beforeEach(() => {
        vi.resetAllMocks();
        setName = vi.fn();
        setAddress = vi.fn();
        setMinPrice = vi.fn();
        setMaxPrice = vi.fn();

        onApplySpy = vi.fn();
        onClearSpy = vi.fn();

        onApply = (p: FiltersPayload) => {
            onApplySpy(p);
        };
        onClear = (p?: FiltersPayload) => {
            onClearSpy(p);
        };

        document.body.style.overflow = '';
    });

    afterEach(() => {
        delete (window as any).matchMedia;
    });

    it('mobile: abre sheet, rellena inputs y aplica llamando setters y onApply', async () => {
        setMatchMedia(false);

        render(
            <FiltersToggle
                name=""
                setName={setName}
                address=""
                setAddress={setAddress}
                minPrice=""
                setMinPrice={setMinPrice}
                maxPrice=""
                setMaxPrice={setMaxPrice}
                onApply={onApply}
                onClear={onClear}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Filtros/i }));

        await waitFor(() => expect(screen.getByPlaceholderText(/Ej: Penthouse/i)).toBeInTheDocument());

        expect(document.body.style.overflow).toBe('hidden');

        fireEvent.change(screen.getByPlaceholderText(/Ej: Penthouse/i), { target: { value: '  Mi Casa  ' } });
        fireEvent.change(screen.getByPlaceholderText(/Ciudad, barrio/i), { target: { value: 'Barrio 1' } });
        fireEvent.change(screen.getByPlaceholderText(/^0$/), { target: { value: '123' } });
        fireEvent.change(screen.getByPlaceholderText(/∞/), { target: { value: '456' } });

        fireEvent.click(screen.getByRole('button', { name: /^Aplicar$/i }));

        await waitFor(() => {
            expect(setName).toHaveBeenCalledWith('Mi Casa');
            expect(setAddress).toHaveBeenCalledWith('Barrio 1');
            expect(setMinPrice).toHaveBeenCalledWith('123');
            expect(setMaxPrice).toHaveBeenCalledWith('456');

            expect(onApplySpy).toHaveBeenCalled();
            const payload: FiltersPayload = onApplySpy.mock.calls[0][0];
            expect(payload).toMatchObject({
                name: 'Mi Casa',
                address: 'Barrio 1',
                minPrice: '123',
                maxPrice: '456',
            });
        });

        await waitFor(() => expect(document.body.style.overflow).toBe(''));
    });

    it('mobile: limpiar llama onClear y vacía valores locales (comprobamos llamada a onClear)', async () => {
        setMatchMedia(false);

        render(
            <FiltersToggle
                name="init"
                setName={setName}
                address="init"
                setAddress={setAddress}
                minPrice="1"
                setMinPrice={setMinPrice}
                maxPrice="2"
                setMaxPrice={setMaxPrice}
                onApply={onApply}
                onClear={onClear}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Filtros/i }));

        await waitFor(() => expect(screen.getByPlaceholderText(/Ej: Penthouse/i)).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /Limpiar/i }));

        await waitFor(() => {
            expect(onClearSpy).toHaveBeenCalled();
            const arg = onClearSpy.mock.calls[0][0];
            if (arg) {
                expect(arg).toMatchObject({ name: '', address: '', minPrice: '', maxPrice: '' });
            }
        });
    });

    it('desktop: abre popover de escritorio (no afecta overflow body)', async () => {
        setMatchMedia(true);

        render(
            <FiltersToggle
                name=""
                setName={setName}
                address=""
                setAddress={setAddress}
                minPrice=""
                setMinPrice={setMinPrice}
                maxPrice=""
                setMaxPrice={setMaxPrice}
                onApply={onApply}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Filtros/i }));

        await waitFor(() => expect(screen.getByPlaceholderText(/Ej: Penthouse/i)).toBeInTheDocument());

        expect(document.body.style.overflow).toBe('');
    });
});
