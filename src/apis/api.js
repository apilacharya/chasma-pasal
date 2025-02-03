import axios from "axios";

//creating backend confug
const api = axios.create({
  baseURL: "http://localhost:3006",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const api2 = axios.create({
  baseURL: "http://localhost:3006",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

//register user api
export const registerUserApi = (data) => api.post("/api/user/create", data);

//login user api
export const loginUserApi = (data) => api.post("/api/user/login", data);

//get user profile api
export const getSingleUserApi = (id) => api.get(`/api/user/profile/${id}`);
export const getUserDataById = (userId) => api.get(`api/user/user/${userId}`);
export const delUserById = (userId) =>
  api.delete(`api/user/delete_account/${userId}`);
export const getUserData = () => api.get(`api/user/all_user`);

//update user profile api
export const updateUserProfile = (id, data) =>
  api.put(`/api/user/update/${id}`, data, config);

//create product api
export const createProductApi = (data) => api.post("/api/product/create", data);

//get all products api
export const getAllProducts = () => api.get("/api/product/get_all_products");

//delete product
export const deleteProduct = (id) =>
  api.delete(`/api/product/delete_product/${id}`);

//get single product
export const getSingleProduct = (id) =>
  api.get(`/api/product/get_single_product/${id}`);

//update product
export const updateProduct = (id, data) =>
  api.put(`/api/product/update_product/${id}`, data);

// forgot password
export const forgotPasswordApi = (data) =>
  api.post("/api/user/forgot_password", data);

// verify otp
export const verifyOtpApi = (data) => api.post("/api/user/verify_otp", data);

//add to cart
export const addToCartApi = (data) =>
  api.post("/api/cart/addToCart", data, config);
export const getCartByUserIDApi = (id) =>
  api.get(`/api/cart/getCartByUserID/${id}`, config);
export const updateCartApi = (id, formData) =>
  api.put(`/api/cart/updateCart/${id}`, formData, config);
export const removeFromCartApi = (id) =>
  api.delete(`/api/cart/removeFromCart/${id}`, config);
export const updateCartStatusApi = (data) =>
  api.put(`/api/cart/status`, data, config);

// API for  order
export const getUserOrdersApi = () => api2.get("/api/order/user", config);
export const getallOrdersApi = () => api2.get("/api/order/get", config);
export const createOrderApi = (data) =>
  api2.post("/api/order/create", data, config);
export const updateOrderApi = (id, data) =>
  api2.put(`/api/order/update/${id}`, data, config);
export const updateOrderStatusApi = (id, data) =>
  api.put(`/api/order/update/${id}`, data, config);

//address api
export const createAddress = (data) =>
  api.post("/api/address/shipping-address", data, config);
export const editAddress = (addressId, data) =>
  api.put(`/api/address/update-shipping-address/${addressId}`, data, config);
export const getAddress = (id) =>
  api.get(`/api/address/getaddress/${id}`, config);
export const deleteAddress = (addressId) =>
  api.delete(`/api/address/deleteaddress/${addressId}`, config);

//review and rating api
export const createReviewApi = (data) =>
  api.post("/api/review/addReview", data, config);
export const updateReviewApi = (id) =>
  api.get(`/api/review/updateReview/${id}`);
export const getReviewsByUserIDApi = (id) =>
  api.get(`/api/review/getReviewsByUserID/${id}`, config);
export const getReviewsByProductID = (id) =>
  api.get(`/api/review/getReviewsByProductID/${id}`);
