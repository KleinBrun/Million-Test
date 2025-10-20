'use client';

import { DetailsCardProps } from "@/types";

export default function DetailsCard({ beds, baths, areaM2, type, year, hoaCOP, formatCOP, title = 'Detalles principales', className = '', }: DetailsCardProps) {
    const F = (v: unknown, suffix?: string) => v === null || v === undefined || v === '' ? '—' : `${v}${suffix ?? ''}`;

    return (
        <div className={`rounded-2xl border p-5 bg-white ${className}`} aria-labelledby="details-title">
            <h3 id="details-title" className="font-semibold mb-3">{title}</h3>

            <ul className="grid grid-cols-2 gap-3 text-sm">
                <li className="flex justify-between gap-2">
                    <span className="text-gray-600">Habitaciones</span>
                    <span className="font-medium">{F(beds)}</span>
                </li>
                <li className="flex justify-between gap-2">
                    <span className="text-gray-600">Baños</span>
                    <span className="font-medium">{F(baths)}</span>
                </li>
                <li className="flex justify-between gap-2">
                    <span className="text-gray-600">Área</span>
                    <span className="font-medium">{areaM2 != null ? `${areaM2} m²` : '—'}</span>
                </li>
                <li className="flex justify-between gap-2">
                    <span className="text-gray-600">Tipo</span>
                    <span className="font-medium">{F(type)}</span>
                </li>
                <li className="flex justify-between gap-2">
                    <span className="text-gray-600">Año</span>
                    <span className="font-medium">{F(year)}</span>
                </li>
                <li className="flex justify-between gap-2">
                    <span className="text-gray-600">Adm. (HOA)</span>
                    <span className="font-medium">{hoaCOP != null ? formatCOP(hoaCOP) : '—'}</span>
                </li>
            </ul>
        </div>
    );
}
