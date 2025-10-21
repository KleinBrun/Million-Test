// components/__test__/AnimatedPage.test.tsx
// test para AnimatedPage — robusto para React 19 + happy-dom
import { render, screen } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';

// Aseguramos React disponible globalmente (resuelve "React is not defined")
const React = require('react');
if (!(globalThis as any).React) {
    (globalThis as any).React = React;
}

// spy para capturar props (siempre recibe un objeto)
const mockMotionProps = vi.fn((props: any = {}) => {
    // guardamos lo esencial solo para las aserciones
    return {
        initial: props.initial,
        animate: props.animate,
        exit: props.exit,
        transition: props.transition,
        key: props.key,
    };
});

// Mock de framer-motion — AnimatePresence passthrough y motion.div con forwardRef
vi.mock('framer-motion', () => {
    const ReactLocal = require('react');

    const AnimatePresence = (props: any) => ReactLocal.createElement(ReactLocal.Fragment, null, props?.children);

    const MotionDiv = ReactLocal.forwardRef((props: any, ref: any) => {
        // registramos props de forma segura
        mockMotionProps(props || {});
        // devolvemos un div sencillo; no usamos props.children directamente para evitar undefined issues
        return ReactLocal.createElement('div', { ref, 'data-testid': 'motion-div' }, props?.children ?? null);
    });

    return {
        __esModule: true,
        AnimatePresence,
        motion: { div: MotionDiv },
        default: { AnimatePresence, motion: { div: MotionDiv } },
    };
});

// IMPORTA tu componente usando alias @ (ajusta si tu ruta es distinta)
import AnimatedPage from '@/components/AnimatedPage';

beforeEach(() => {
    mockMotionProps.mockClear();
});

describe('AnimatedPage (happy-dom)', () => {
    it('renderiza children y usa variante "fade" por defecto', () => {
        render(React.createElement(AnimatedPage, { pageKey: 'page-1' }, 'Contenido Fade'));

        expect(screen.getByText('Contenido Fade')).toBeTruthy();
        expect(mockMotionProps).toHaveBeenCalled();

        const props = mockMotionProps.mock.calls[0][0];
        expect(props.initial).toEqual({ opacity: 0, y: 20 });
        expect(props.animate).toEqual({ opacity: 1, y: 0 });
        expect(props.exit).toEqual({ opacity: 0, y: -20 });
        expect(props.transition).toMatchObject({ duration: 0.4, ease: 'easeInOut' });
    });

    it('usa variante "slide" cuando se pasa el prop', () => {
        render(React.createElement(AnimatedPage, { pageKey: 'page-2', variant: 'slide' }, 'Contenido Slide'));

        expect(screen.getByText('Contenido Slide')).toBeTruthy();
        expect(mockMotionProps).toHaveBeenCalled();

        const props = mockMotionProps.mock.calls[0][0];
        expect(props.initial).toEqual({ opacity: 0, x: 50 });
        expect(props.animate).toEqual({ opacity: 1, x: 0 });
        expect(props.exit).toEqual({ opacity: 0, x: -50 });
        expect(props.transition).toMatchObject({ duration: 0.4, ease: 'easeInOut' });
    });
});
