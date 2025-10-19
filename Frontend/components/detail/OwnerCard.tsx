'use client';

import { Owner } from "@/types";

export default function OwnerCard({ owner }: { owner?: Owner }) {
    if (!owner) return null;
    return (
        <div className="rounded-2xl border p-5 bg-white flex gap-4 items-center">
            <img
                src={owner.photo ?? 'https://placehold.co/80x80?text=👤'}
                alt={owner.name}
                className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
                <h3 className="font-semibold">{owner.name}</h3>
                {owner.address && <p className="text-sm text-gray-600">{owner.address}</p>}
            </div>
        </div>
    );
}
