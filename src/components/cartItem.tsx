import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { type CartItem as CartItemTypes } from "../types/types";

type CartItemProps = {
  cartItem: CartItemTypes;
  incrementHandler: (cartItem: CartItemTypes) => void;
  decrementHandler: (cartItem: CartItemTypes) => void;
  removeHandler: (id: string) => void;
};

const server = import.meta.env.VITE_SERVER;
const CartItem = ({ cartItem, incrementHandler,
  decrementHandler,
  removeHandler, }: CartItemProps) => {
  const { productId, name, price, quantity, photo } = cartItem;

  return (
    <div className="p-4 flex flex-row justify-start items-center gap-12">
      <div className="flex items-center gap-2">
        <img
          src={`${server}/${photo}`}
          alt={name}
          className="w-40 h-40 object-contain"
        />
        <article className="flex flex-col justify-center items-start gap-1">
          <Link
            to={`/product/${productId}`}
            className="text-[1.2rem] text-blue-600 hover:text-blue-800"
          >
            {name}
          </Link>
          <span className="font-bold text-gray-700">Price: ₹{price}</span>
          <span className="font-bold text-gray-700">Quantity: {quantity}</span>
        </article>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
          disabled={quantity <= 1}
          onClick={() => decrementHandler(cartItem)}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md text-[1.2rem] bg-gray-400 hover:bg-blue-600 hover:text-white hover:cursor-pointer"
          >
            -
          </button>
          <p>{quantity}</p>
          <button
          disabled={quantity >= cartItem.stock}
          onClick={() => incrementHandler(cartItem)}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md text-[1.2rem] bg-gray-400 hover:bg-blue-600 hover:text-white hover:cursor-pointer"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeHandler(productId)}
          type="button"
          title="Remove"
          className="text-[1.2rem] text-red-500 hover:text-red-700 transition-colors flex items-center justify-center hover:cursor-pointer w-8 h-8 rounded-md "
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
