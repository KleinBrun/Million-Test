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

export function parseNumber(value: string | number | undefined | null): number | null {
    if (value === "" || value === undefined || value === null) return null;
    const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, "."));
    return Number.isFinite(n) ? n : null;
}
export function copToMM(value: string | number | undefined | null): string {
    const n = parseNumber(value);
    if (n === null) return "";
    return String(n / 1_000_000);
}
export function mmToCOP(value: string | number | undefined | null): string {
    const n = parseNumber(value);
    if (n === null) return "";
    // redondeo a entero (COP) para evitar decimales de centavos
    return String(Math.round(n * 1_000_000));
}