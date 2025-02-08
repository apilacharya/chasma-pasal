import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar";
import ShippingAddressForm from "./pages/address/AddressForm";
import AdminDashboard from "./pages/admin/admin_dashboard/AdminDashboard";
import UpdateProduct from "./pages/admin/admin_update/UpdateProduct";
import ViewOrders from "./pages/admin/view_orders/ViewOrders";
import ViewUsers from "./pages/admin/view_user/ViewUsers";
import Cart from "./pages/cart/Cart";
import Dashboard from "./pages/dashboard/Dashboard";
import ForgotPassword from "./pages/forget_password/ForgetPassword";
import Login from "./pages/login/Login";
import OrderList from "./pages/order/OrderList";
import ProductDescription from "./pages/productview/ProdictDescription";
import Profile from "./pages/profile/Profile";
import AdminRoutes from "./pages/protected/adminprot";
import Register from "./pages/registration/Register";
import NavbarComponent from "./components/Navbar";
import EsewaResponse from "./pages/cart/paymentGateway/esewa/EsewaResponse";

function UserLayout() {
  return (
    <>
      <NavbarComponent />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route element={<UserLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/forgot_password' element={<ForgotPassword />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/address' element={<ShippingAddressForm />} />
          <Route path='/product/:id' element={<ProductDescription />} />
          <Route path='/orderlist' element={<OrderList />} />
          <Route path='/esewa-response' element={<EsewaResponse />} />

          {/* Protected routes  */}
          {/* <Route path='/admin/' element={<AdminDashboard />} />
          <Route path='/admin/update/:id' element={<UpdateProduct />} />
          <Route path='/admin/order' element={<ViewOrders />} />
          <Route path='/admin/customers' element={<ViewUsers />} /> */}
        </Route>

        <Route element={<AdminRoutes />}>
          <Route path='/admin/' element={<AdminDashboard />} />
          <Route path='/admin/update/:id' element={<UpdateProduct />} />
          <Route path='/admin/order' element={<ViewOrders />} />
          <Route path='/admin/customers' element={<ViewUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
