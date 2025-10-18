import { Property } from '../types/property';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
    properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
                <PropertyCard key={property.idOwner} property={property} />
            ))}
        </div>
    );
}
