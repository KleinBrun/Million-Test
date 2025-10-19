'use client';

import { MapsProps } from "@/types";

export default function MapEmbed({ address }: MapsProps) {
    return (
        <section className="rounded-2xl border p-5 bg-white">
            <h3 className="font-semibold mb-2">Ubicación</h3>
            <p className="text-sm text-gray-600 mb-3">{address}</p>
            <div className="aspect-video w-full rounded-xl overflow-hidden border">
                <iframe
                    title="Mapa de ubicación"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`}
                />
            </div>
        </section>
    );
}
