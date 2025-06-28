import CartItem from "@/components/cartItem";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { type CartItem as CartItemType } from "@/types/types";
import type { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  calculatePrice,
  removeCartItem,
} from "../redux/reducer/cartReducer";

const Cart = () => {
  const { cartItems, subtotal, tax, total, shippingCharges } = useSelector(
    (state: RootState) => state.cartReducer
  );

  const dispatch = useDispatch();

  const incrementHandler = (cartItem: CartItemType) => {
    if (cartItem.quantity >= cartItem.stock) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItemType) => {
    if (cartItem.quantity <= 1) return;

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="flex items-start justify-center p-16 h-[calc(100vh-4rem)]">
      <main className="w-[70%] overflow-y-auto -webkit-scrollbar:hidden">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-500">
              Start shopping to add items to your cart
            </p>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <CartItem
                key={item.productId}
                cartItem={item}
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
              />
            ))}
          </div>
        )}
      </main>
      {cartItems.length > 0 && (
        <aside className="w-[30%] p-16 flex flex-col gap-4 items-stretch">
          <div className="flex flex-col gap-6 text-lg">
            <p>Subtotal: ₹{subtotal}</p>
            {shippingCharges ? <p>Shipping Charges: ₹{shippingCharges}</p>:''}
            <p>Tax: ₹{tax}</p>

            <p>
              <b>Total: ₹{total}</b>
            </p>
          </div>
          
          <Link
            className="bg-sky-800 text-amber-50 rounded p-4 text-center hover:bg-sky-700 transition-colors font-medium text-sm"
            to={"/shipping"}
          >
            Checkout
          </Link>
          
        </aside>
      )}
    </div>
  );
};

export default Cart;
