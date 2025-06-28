import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { MessageResponse } from "@/types/api-types";
import { useDispatch } from "react-redux";
import { getUser } from "@/redux/api/userAPI";
import { userExist, userNotExist } from "@/redux/reducer/userReducer";

const Login = () => {
    const dispatch = useDispatch();
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        name: user.displayName || `${user.email}`,
        email: user.email || "",
        photo: user.photoURL || "",
        gender,
        dob: date,
        role: "user",
        _id: user.uid,
      });
      console.log("Login response:", res);
      if ("data" in res) {
        toast.success(res?.data?.message || "Sign In Success");
        const data = await getUser(user.uid);
        dispatch(userExist(data?.user));
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse)?.message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Sign In Fail");
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center">
      <main className="w-full max-w-md h-[80%] p-8 shadow-md flex flex-col items-center gap-6 bg-white rounded-md">
        <h1 className="text-2xl font-bold tracking-wide">Login</h1>

        <div className="w-full flex flex-col gap-1 items-start">
          <label className="font-medium">Gender</label>
          <select
            title="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-md font-[Segoe UI] outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="w-full flex flex-col gap-1 items-start">
          <label className="font-medium">Date of birth</label>
          <input
            title="Date of Birth"
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border border-gray-400 rounded-md font-[Segoe UI] outline-none"
          />
        </div>

        <div className="w-full flex flex-col items-center">
          <p className="text-center my-8">Already Signed In Once</p>
          <button
            type="button"
            onClick={loginHandler}
            className="w-[70%] h-12 bg-blue-600 text-white border border-blue-600 rounded-md flex items-center justify-between text-[1.05rem] overflow-hidden hover:cursor-pointer"
          >
            <FcGoogle className="bg-white w-[30%] h-full p-2" />
            <span className="w-full text-center">Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
