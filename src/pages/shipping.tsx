import { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import { type RootState, server } from "../redux/store";
import axios from "axios";

const Shipping = () => {
  const { cartItems ,total} = useSelector(
    (state: RootState) => state.cartReducer
  );

  console.log(total);
  const { user } = useSelector((state: RootState) => state.userReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "india",
    pinCode: "",
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(saveShippingInfo(shippingInfo));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create-payment?id=${user?._id}`,
        {
          items: cartItems,
          shippingInfo,
          amount: total * 100, // Convert to paise
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (cartItems.length <= 0) {
      navigate("/cart");
    } 
  }, [cartItems]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <button
        title="Back to Cart"
        type="button"
        className="absolute top-[10%] left-8 w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full shadow-md hover:bg-blue-700 transition-colors hover:cursor-pointer"
        onClick={() => navigate("/cart")}
      >
        <BiArrowBack className="transition-transform hover:-translate-x-1" />
      </button>

      <form
        onSubmit={submitHandler}
        className="w-full max-w-md flex flex-col items-center gap-8 p-8 shadow-lg rounded-lg bg-white"
      >
        <h1 className="text-2xl font-bold tracking-wider mb-4 text-center">
          Shipping Address
        </h1>

        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
          className="w-full border border-gray-400 p-4 rounded-md text-[1.05rem] outline-none"
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
          className="w-full border border-gray-400 p-4 rounded-md text-[1.05rem] outline-none"
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
          className="w-full border border-gray-400 p-4 rounded-md text-[1.05rem] outline-none"
        />

        <select
          title="Country"
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
          className="w-full border border-gray-400 p-4 rounded-md text-[1.05rem] outline-none"
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>

        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
          className="w-full border border-gray-400 p-4 rounded-md text-[1.05rem] outline-none"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-md text-[1.05rem] uppercase tracking-widest hover:opacity-80 transition-opacity"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Shipping;
