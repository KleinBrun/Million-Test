export default function PropertyDetailSkeleton() {
    return (
        <div className="container mx-auto p-6">
            <div className="relative overflow-hidden h-10 w-32 mb-6 rounded bg-gray-300">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
            </div>

            <div className="relative overflow-hidden h-96 w-full mb-6 rounded-lg bg-gray-300">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
            </div>

            <div className="space-y-4">
                <div className="relative overflow-hidden h-8 bg-gray-300 w-3/4 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                </div>
                <div className="relative overflow-hidden h-6 bg-gray-300 w-1/2 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                </div>
                <div className="relative overflow-hidden h-6 bg-gray-300 w-1/3 rounded">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                </div>

                <div className="space-y-2 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden h-4 bg-gray-300 w-full rounded"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
