"use client";

export default function ProductSkeleton() {
    return (
        <div className="bg-white group animate-pulse">
            <div className="relative aspect-[3/4] w-full mb-3 overflow-hidden bg-gray-200 rounded-lg">
                <div className="w-full h-full bg-slate-200"></div>
            </div>
            <div className="space-y-2 px-1">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-100 rounded w-full mt-3"></div>
            </div>
        </div>
    );
}
