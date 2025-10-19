'use client';

import { MortgageCardProps } from "@/types";

export default function MortgageCard({ monthlyUSD, formatUSD, rateMonthly, years, downPct }: MortgageCardProps) {
    return (
        <div className="rounded-2xl border p-5 bg-white">
            <h3 className="font-semibold mb-3">Estimar hipoteca</h3>
            <p className="text-sm text-gray-600">
                Cuota mensual aprox:{' '}
                <span className="font-semibold text-gray-900">{monthlyUSD ? formatUSD(monthlyUSD) : '—'}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
                Entrada: {Math.round(downPct * 100)}% · Plazo: {years} años · Tasa: {(rateMonthly * 100).toFixed(2)}% m
            </p>
        </div>
    );
}
