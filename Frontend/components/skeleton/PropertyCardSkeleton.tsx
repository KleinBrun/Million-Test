export default function PropertyCardSkeleton() {
    return (
        <div className="rounded-lg shadow-lg overflow-hidden bg-gray-300 relative">
            {/* Imagen */}
            <div className="relative h-64 w-full overflow-hidden bg-gray-300">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
            </div>

            {/* Contenido */}
            <div className="p-4 space-y-2">
                <div className="relative h-6 w-3/4 bg-gray-300 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                </div>
                <div className="relative h-4 w-1/2 bg-gray-300 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                </div>
                <div className="relative h-4 w-1/3 bg-gray-300 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                </div>
            </div>
        </div>
    );
}
