

const ProductSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse flex flex-col space-y-4 p-4 rounded-2xl shadow-sm"
        >
          <div className="bg-gray-300 h-40 w-full rounded-lg" />

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>

          <div className="h-6 bg-gray-300 rounded w-1/3 mt-2" />
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
