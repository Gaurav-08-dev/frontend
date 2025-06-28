import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "@/redux/api/productAPI";
import { useState } from "react";
import { type CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import ProductSkeleton  from "../components/skeletonLoader";
import { type CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/productCard";

const Search = () => {
  const dispatch = useDispatch();
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  const searchQuery = useSearchParams()[0];
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState(searchQuery.get("category") || "");
  const [page, setPage] = useState(1);

  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({
    search,
    sort,
    category,
    page,
    price: maxPrice,
  });

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  
  const addToCartHandler = (cartItem: CartItem) => {
      if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }
  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="p-8 flex min-h-[calc(100vh-6.5vh)] gap-8">
      {/* Sidebar Filters */}
      <aside className="min-w-[20rem] shadow-md p-8 flex flex-col gap-4">
        <h2 className="text-2xl font-bold tracking-wide">Filters</h2>

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Sort</h4>
          <select
            name="sort"
            id="sort"
            title="Sort by price"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full p-4 border border-gray-400 rounded-lg bg-white"
          >
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Max Price: {maxPrice || ""}</h4>
          <input
            title="Max Price"
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="accent-blue-600"
          />
        </div>

        <div className="flex flex-col gap-2">
          <h4 className="font-semibold">Category</h4>
          <select
            name="category"
            id="category"
            title="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border border-gray-400 rounded-lg bg-white"
          >
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full px-8">
        <h1 className="text-2xl font-bold tracking-wide mb-4">Products</h1>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 p-3 mb-6 border-none text-[1.2rem] outline-none"
        />

        {productLoading ? (
          <ProductSkeleton count={10} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 overflow-y-auto max-h-[calc(100%-10rem)] p-4">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                imageUrl={i.photo}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article className="flex items-center justify-center gap-4 mt-8">
            <button
            type="button"
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="font-medium">
              {page} of {searchedData.totalPage}
            </span>
            <button
            type="button"
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
