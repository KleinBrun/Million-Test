'use client';

import { TraceProps } from "@/types";

export default function TracesTable({ traces, formatCOP }: TraceProps) {
    if (!traces || traces.length === 0) return null;
    return (
        <section className="rounded-2xl border p-5 bg-white">
            <h3 className="font-semibold mb-3">Historial de ventas</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Valor</th>
                            <th className="p-2 border">Impuesto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {traces.map((t, idx) => (
                            <tr key={t.idPropertyTrace ?? idx}>
                                <td className="p-2 border">{new Date(t.dateSale).toLocaleDateString()}</td>
                                <td className="p-2 border">{t.name}</td>
                                <td className="p-2 border">{formatCOP(t.value)}</td>
                                <td className="p-2 border">{formatCOP(t.tax)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
