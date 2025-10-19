export interface Owner {
    idOwner?: string;
    name: string;
    address?: string;
    photo?: string;
    birthday?: string;
}

export interface PropertyImage {
    idPropertyImage: string;
    idProperty: string;
    file: string;
    enabled: boolean;
}

export interface PropertyTrace {
    idPropertyTrace: string;
    dateSale: string;
    name: string;
    value: number;
    tax: number;
    idProperty: string;
}

export interface Property {
    idProperty: string;
    name: string;
    address: string;
    price: number;
    codeInternal: string;
    year: number;
    owner?: Owner;
    images: PropertyImage[];
    traces: PropertyTrace[];
}

export type Trace = {
    idPropertyTrace?: string;
    dateSale: string | Date;
    name: string;
    value: number;
    tax: number;
};

export interface FiltersProps {
    name: string;
    setName: (value: string) => void;
    address: string;
    setAddress: (value: string) => void;
    minPrice: string;
    setMinPrice: (value: string) => void;
    maxPrice: string;
    setMaxPrice: (value: string) => void;
    onApply: () => void;
    onClear: () => void;
}

export interface FilterFormProps {
    onFilter: (filters: Partial<Property & { minPrice?: number; maxPrice?: number }>) => void;
}

export interface CardProps {
    property: Property;
}

export interface PropertyListProps {
    properties: Property[];
}

export interface PropertyState {
    properties: Property[];
    setMany: (props: Property[]) => void;
    getOne: (id: string) => Property | undefined;
    setOne: (prop: Property) => void;

    filters: {
        name: string;
        address: string;
        minPrice: string;
        maxPrice: string;
        currentPage: number;
    };
    setFilters: (filters: Partial<PropertyState['filters']>) => void;

    rehydrated: boolean;
}