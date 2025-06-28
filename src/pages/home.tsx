import ProductCard from "@/components/productCard";
import { useLatestProductsQuery } from "@/redux/api/productAPI";
import { Link } from "react-router-dom";
import { type CartItem } from "../types/types";
import { toast } from "react-hot-toast";
import Loader from "@/components/loader";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/reducer/cartReducer";

const Home = () => {
  const dispatch = useDispatch();
  const { data, isError, isLoading } = useLatestProductsQuery("");

  console.log(data)
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="py-8 px-[5%] flex flex-col gap-4 w-full overflow-auto">
      <section className="w-full h-72 bg-[url(/assets/cover.jpg)] bg-no-repeat bg-center bg-cover"></section>
      <h1 className="text-2xl font-bold mt-12 mb-4 flex justify-between items-center">
        <span className="text-gray-500 font-extralight">
          Shop the latest trends
        </span>
        <Link
          to="/search"
          className="text-lg font-extralight transition-colors hover:text-gray-500"
        >
          More
        </Link>
      </h1>
      {isLoading ? (
        <Loader />
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              imageUrl={product.photo}
              stock={product.stock}
              handler={addToCartHandler}
            />
          ))}
        </main>
      )}
    </div>
  );
};

export default Home;


