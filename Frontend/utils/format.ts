export const formatCOP = (n?: number) =>
    n == null ? '' : new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(n);

export const formatUSD = (n?: number) =>
    n == null ? '' : new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(n);
