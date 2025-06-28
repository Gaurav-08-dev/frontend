import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, 
    // useSelector
 } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import ProductSkeleton from "@/components/skeletonLoader";
import { useProductDetailsQuery } from "../redux/api/productAPI";
import { addToCart } from "@/redux/reducer/cartReducer";
// import { type RootState } from "../redux/store";
import { type CartItem } from "../types/types";


const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

//   const { user } = useSelector((state: RootState) => state.userReducer);
const server= import.meta.env.VITE_SERVER;
  const { isLoading, isError, data } = useProductDetailsQuery(params.id!);

  const [quantity, setQuantity] = useState(1);

  const decrement = () => setQuantity((prev) => prev - 1);
  const increment = () => {
    if (data?.product?.stock === quantity)
      return toast.error(`${data?.product?.stock} available only`);
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");

    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) return <Navigate to="/404" />;

  
  return (
    <div className="min-h-screen bg-white">
  {isLoading ? (
    <ProductSkeleton />
  ) : (
    <main className="flex flex-col md:flex-row gap-10 py-10 px-[5%] max-w-7xl mx-auto">
      {/* Product Image */}
      <section className="w-full md:w-1/2 flex items-center justify-center">
        <img
          src={`${server}/${data?.product?.photo}`}
          alt={data?.product?.name}
          className="rounded-xl shadow-lg object-contain w-full max-w-md"
        />
      </section>

      {/* Product Details */}
      <section className="w-full md:w-1/2 space-y-6">
        <code className="text-sm text-gray-500 uppercase tracking-wide">
          {data?.product?.category}
        </code>

        <h1 className="text-3xl font-bold text-gray-800">
          {data?.product?.name}
        </h1>

        <h3 className="text-2xl font-semibold text-blue-600">
          ₹{data?.product?.price}
        </h3>

        <article className="space-y-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <button
              disabled={quantity <= 1}
              type="button"
              onClick={decrement}
              className="hover:cursor-pointer px-3 py-1.5 text-lg rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              disabled={data?.product?.stock === quantity}
              type="button"
              onClick={increment}
              className="hover:cursor-pointer px-3 py-1.5 text-lg rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button

            type="button"
            onClick={() =>
              addToCartHandler({
                productId: data?.product?._id || "",
                name: data?.product?.name || "",
                price: data?.product?.price || 0,
                stock: data?.product?.stock || 0,
                quantity,
                photo: data?.product?.photo || "",
              })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow transition-all duration-200 hover:cursor-pointer"
          >
            Add To Cart
          </button>
        </article>

        {/* Product Description */}
        <p className="text-gray-600 leading-relaxed">
          {data?.product?.description}
        </p>
      </section>
    </main>
  )}
</div>

  );
};

export default ProductDetails;
