
export const PageLoader = () => (
    <div className="flex h-full items-center justify-center">
        <div className="space-y-4 w-full max-w-2xl p-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
        </div>
    </div>
);
