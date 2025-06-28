import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./firebase";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/userAPI";
import { type RootState } from "./redux/store";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./components/loader";
import Header from "./components/header";
import ProtectedRoute from "./components/protectedRoute";
import ProductDetails from "./pages/productDetails";
import Checkout from "./pages/checkout";


const Home = lazy(() => import("./pages/home"));
const Cart = lazy(() => import("./pages/cart"));
const Search = lazy(() => import("./pages/search"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/orderDetails"));

function App() {
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExist(data.user));
      } else dispatch(userNotExist());
    });
  }, []);

  return loading ? (
    <Loader/>
  ) : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        {/* Header */}
        <Routes>
          {/* For all users */}
          <Route path="/" element={<Home />} />
           <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Not logged in */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={!user? true : false}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Logged in user routes */}
          <Route element={<ProtectedRoute isAuthenticated={user ? true: false} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
}

export default App;
