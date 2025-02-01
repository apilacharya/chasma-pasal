import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { message } from "antd";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { CountUp } from "use-count-up";
import {
  createOrderApi,
  getAddress,
  getCartByUserIDApi,
  removeFromCartApi,
  updateCartApi,
  updateCartStatusApi,
} from "../../apis/api";
import FooterCard from "../../components/FooterCard";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(150);
  const [total, setTotal] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [change, setChange] = useState(false);

  useEffect(() => {
    getCartByUserIDApi()
      .then((res) => {
        // Assuming that cart items have a `status` field
        const activeCartItems =
          res.data.cart?.filter((item) => item.status === "active") || [];

        console.log("Active Cart Items:", activeCartItems);
        setCartItems(activeCartItems || []);
        // console.log("Cart data:", res.data.cart);
        // setCartItems(res.data.cart || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [change]);

  useEffect(() => {
    calculateCartTotal();
  }, [cartItems]);

  const calculateCartTotal = () => {
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      const newSubtotal = cartItems.reduce((acc, cart) => {
        const itemTotal = cart.productID
          ? cart.productID.productPrice * cart.quantity
          : 0;
        return acc + itemTotal;
      }, 0);
      setSubtotal(newSubtotal);
      setTotal(newSubtotal + shipping);
    } else {
      setSubtotal(0);
      setTotal(shipping); // If the cart is empty, total is just the shipping cost
    }
  };
  useEffect(() => {
    getAddress(user._id)
      .then((res) => {
        console.log("address", res.data.addresses);
        setAddresses(res.data.addresses || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleQuantityChange = (value, cart) => {
    if (value < 1 || !cart.productID) return; // Add check for cart.productID

    const updatedCartItems = cartItems.map((item) =>
      item._id === cart._id
        ? {
            ...item,
            quantity: value,
            total: item.productID ? item.productID.productPrice * value : 0, // Check for productID
          }
        : item
    );
    setCartItems(updatedCartItems);

    const data = {
      quantity: value,
      total: cart.productID ? cart.productID.productPrice * value : 0, // Check for productID
    };

    updateCartApi(cart._id, data)
      .then(() => {
        message.success("Cart updated successfully");
      })
      .catch((err) => {
        message.error(err.response?.data?.message || "Something went wrong");
      });
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm(
      "Are you sure you want to remove this item from the cart?"
    );
    if (confirmDialog) {
      removeFromCartApi(id)
        .then((res) => {
          if (res.data.success) {
            setCartItems(cartItems.filter((item) => item._id !== id));
            toast.success(res.data.message);
            calculateCartTotal(); // Recalculate totals after deletion
          } else {
            toast.error(res.data.message);
          }
        })
        .catch((error) => {
          toast.error("Server Error");
          console.error(error.message);
        });
    }
  };

  const handleProceedToCheckout = () => {
    console.log("Proceed to checkout");
    setShowPopup(true);
  };

  const handleConfirmOrder = () => {
    if (paymentMethod === "Khalti") {
      handleKhaltiPayment();
    } else if (paymentMethod === "COD") {
      const confirmDialog = window.confirm(
        "Do you really want to place the order?"
      );
      if (confirmDialog) {
        saveOrder("Cash on Delivery");
      }
    }
  };

  const handleKhaltiPayment = () => {
    let config = {
      publicKey: "test_public_key_0800545e039d45368cab4d1b2fb93d01",
      productIdentity: "1234567890",
      productName: "Cart Items",
      productUrl: "http://example.com/cart",
      eventHandler: {
        onSuccess(payload) {
          console.log("Khalti success payload:", payload);
          toast.success("Payment Successful!");
          saveOrder("Payment made via Khalti");
        },
        onError(error) {
          console.log("Khalti error:", error);
          toast.error("Payment Failed. Please try again.");
        },
        onClose() {
          console.log("Khalti widget is closing");
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };

    let checkout = new KhaltiCheckout(config);
    checkout.show({ amount: total * 100 });
  };

  const saveOrder = (paymentMethod) => {
    const cartIDs = cartItems.map((item) => item._id);
    const orderData = {
      userId: user._id,
      carts: cartIDs,
      total,
      address: selectedAddress,
      paymentType: paymentMethod,
    };

    createOrderApi(orderData)
      .then((res) => {
        if (res.data.success) {
          updateCartStatusApi({ status: "ordered" }).then((response) => {
            setChange(!change);
          });
          toast.success("Order placed successfully!");
          setCartItems([]); // Clear the cart
          setShowPopup(false);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error("Server Error");
        console.log("Order creation error:", err.message);
      });
  };

  const handleAddressChange = (value) => {
    if (value === "add-new") {
      navigate("/address");
    } else {
      setSelectedAddress(value);
    }
  };

  return (
    <>
      <div className='container mx-auto p-4'>
        <div className='cart-container'>
          {cartItems && cartItems.length > 0 ? (
            <>
              <table className='w-full table-auto'>
                <thead>
                  <tr className='text-left border-b'>
                    <th className='py-2'>PRODUCT</th>
                    <th className='py-2'>NAME</th>
                    <th className='py-2'>PRICE</th>
                    <th className='py-2'>QTY</th>
                    <th className='py-2'>SUBTOTAL</th>
                    <th className='py-2'>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((cart) => (
                    <tr key={cart._id} className='border-b'>
                      <td className='flex items-center py-4'>
                        <img
                          src={
                            cart.productID
                              ? `http://localhost:5000/products/${cart.productID.productImage}`
                              : "/placeholder.png"
                          }
                          alt={
                            cart.productID
                              ? cart.productID.productName
                              : "Product Image"
                          }
                          className='w-20 h-20'
                        />
                      </td>
                      <td>
                        {cart.productID
                          ? cart.productID.productName
                          : "Unknown Product"}
                      </td>
                      <td>
                        NPR.{" "}
                        {cart.productID ? cart.productID.productPrice : "N/A"}
                      </td>
                      <td className='flex items-center'>
                        <button
                          className='qty-btn'
                          onClick={() =>
                            handleQuantityChange(cart.quantity - 1, cart)
                          }
                        >
                          -
                        </button>
                        <span className='mx-2'>{cart.quantity || 1}</span>
                        <button
                          className='qty-btn'
                          onClick={() =>
                            handleQuantityChange(cart.quantity + 1, cart)
                          }
                        >
                          +
                        </button>
                      </td>
                      <td>
                        NPR.{" "}
                        {cart.productID
                          ? (cart.quantity || 1) * cart.productID.productPrice
                          : "N/A"}
                      </td>
                      <td className='flex justify-around'>
                        <button
                          onClick={() => handleDelete(cart._id)}
                          className='btn btn-danger'
                        >
                          <DeleteOutlineIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='summary-container mt-8'>
                <div className='summary'>
                  <h4 className='summary-heading'>Order Summary</h4>
                  <div className='flex justify-between py-2 font-bold'>
                    <span>Subtotal</span>
                    <span>NPR. {subtotal}</span>
                  </div>
                  <div className='flex justify-between py-2 font-bold'>
                    <span>Shipping</span>
                    <span>NPR. {shipping}</span>
                  </div>
                  <div className='flex justify-between py-2 font-bold'>
                    <span>Total</span>
                    <span>NPR. {total}</span>
                  </div>
                  <button
                    className='btn btn-primary mt-4 w-full'
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>
      {showPopup && (
        <div className='popup-container fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='popup-content p-4 bg-white rounded-lg w-full max-w-lg'>
            <h2 className='text-lg font-semibold mb-4'>Continue to Order</h2>
            <div className='mb-2'>
              <label htmlFor='address-select' className='block mb-2'>
                Select Address:
              </label>{" "}
              <br />
              <select
                id='address-select'
                value={selectedAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                className='w-full p-2 border rounded-md'
              >
                <option value=''>Select an address</option>
                {addresses.map((address, index) => (
                  <option key={index} value={address.address}>
                    {address.address}
                  </option>
                ))}

                <option value='add-new' style={{ backgroundColor: "#D29062" }}>
                  Add New Address
                </option>
              </select>
            </div>
            <div className='payment-method mb-4'>
              <h3 className='font-semibold mb-2'>Payment Method</h3>
              <label className='block'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='Khalti'
                  checked={paymentMethod === "Khalti"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='mr-2'
                />
                Khalti
              </label>
              <label className='block mt-2'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='COD'
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='mr-2'
                />
                Cash on Delivery
              </label>
            </div>
            <div className='text-center'>
              <button
                className='continue-btn text-white py-2 px-4 rounded-md'
                style={{ backgroundColor: "#D29062" }}
                onClick={handleConfirmOrder}
              >
                Continue to Order
              </button>
              <button
                className='continue-btn text-white py-2 px-4 rounded-md mt-3'
                style={{ backgroundColor: "#D29062" }}
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterCard />
    </>
  );
};

export default Cart;
