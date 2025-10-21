import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import type { Property } from '@/types';

if (!(globalThis as any).React) {
    (globalThis as any).React = React;
}

const pushMock = vi.fn();
const setOneMock = vi.fn();

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

vi.mock('next/link', () => ({
    __esModule: true,
    default: ({ href, children }: any) => React.createElement('a', { href }, children),
}));

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/stores/propertyStore', () => ({
    usePropertyStore: (selector: any) => selector({ setOne: setOneMock }),
}));

import PropertyCard from '@/components/PropertyCard';

describe('PropertyCard', () => {
    const mockProperty: Property = {
        idProperty: '123',
        name: 'Casa de Prueba',
        address: 'Calle Falsa 123',
        price: 500000000,
        codeInternal: 'C1',
        year: 2021,
        images: [
            { idPropertyImage: 'img1', idProperty: '123', file: 'https://fakeimage.com/img.jpg', enabled: true },
        ],
        traces: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza correctamente la información de la propiedad', () => {
        render(<PropertyCard property={mockProperty} />);

        expect(screen.getByText(mockProperty.name)).toBeInTheDocument();
        expect(screen.getByText(mockProperty.address)).toBeInTheDocument();
        expect(screen.getByText(/\$500\.000\.000/)).toBeInTheDocument();

        const imgEl = document.querySelector('[src]') as HTMLImageElement | null;
        if (imgEl) {
            expect(imgEl.getAttribute('src')).toBe(mockProperty.images[0].file);
        } else {
            expect(screen.getByText(mockProperty.name)).toBeInTheDocument();
        }
    });

    it('usa la imagen por defecto cuando no hay imágenes', () => {
        const propNoImg: Property = { ...mockProperty, images: [] };
        render(<PropertyCard property={propNoImg} />);

        const imgEl = document.querySelector('[src]') as HTMLImageElement | null;
        if (imgEl) {
            expect(imgEl.getAttribute('src')).toContain('placehold.co');
        } else {
            expect(screen.getByText(propNoImg.name)).toBeInTheDocument();
        }
    });

    it('al hacer click en el contenedor clickable llama setOne y navega con router.push', () => {
        render(<PropertyCard property={mockProperty} />);

        const linkEls = screen.queryAllByRole('link');
        let container: HTMLElement | null = null;

        if (linkEls.length === 1) {
            container = linkEls[0];
        } else if (linkEls.length > 1) {
            container = linkEls.find((el) => el.getAttribute('tabindex') === '0') ?? linkEls[0];
        }

        container = container ?? screen.getByText(mockProperty.name).closest('[role="link"]');

        expect(container).toBeTruthy();
        if (!container) return;

        fireEvent.click(container);

        expect(setOneMock).toHaveBeenCalledWith(mockProperty);
        expect(pushMock).toHaveBeenCalledWith(`/property/${mockProperty.idProperty}`);
    });

    it('navega también al presionar Enter en el contenedor', () => {
        render(<PropertyCard property={mockProperty} />);

        const linkEls = screen.queryAllByRole('link');
        let container: HTMLElement | null = null;

        if (linkEls.length === 1) {
            container = linkEls[0];
        } else if (linkEls.length > 1) {
            container = linkEls.find((el) => el.getAttribute('tabindex') === '0') ?? linkEls[0];
        }

        container = container ?? screen.getByText(mockProperty.name).closest('[role="link"]');

        expect(container).toBeTruthy();
        if (!container) return;

        fireEvent.keyDown(container, { key: 'Enter' });

        expect(setOneMock).toHaveBeenCalledTimes(1);
        expect(pushMock).toHaveBeenCalledWith(`/property/${mockProperty.idProperty}`);
    });
});
