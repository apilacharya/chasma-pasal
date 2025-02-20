import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { message } from "antd";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidV4 } from "uuid";
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
import { hashValue } from "./paymentGateway/esewa/EsewaCrypto";

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
    console.log(paymentMethod);
  }, [paymentMethod]);

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
    {
      if (selectedAddress) {
        if (paymentMethod === "Khalti") {
          handleKhaltiPayment();
        } else if (paymentMethod === "Esewa") {
          const cartIDs = cartItems.map((item) => item._id);
          localStorage.setItem("userId", user._id);
          localStorage.setItem("carts", cartIDs);
          localStorage.setItem("total", total);
          localStorage.setItem("address", selectedAddress);
          localStorage.setItem("paymentType", paymentMethod);
          console.log("eseaw payment initiated");
          if (buttonRef.current) {
            buttonRef.current.click();
          } else {
            console.error("Esewa button reference is null");
          }
        } else if (paymentMethod === "COD") {
          const confirmDialog = window.confirm(
            "Do you really want to place the order?"
          );
          if (confirmDialog) {
            saveOrder("Cash on Delivery");
          }
        }
      } else {
        toast.error("Select a Shipping Location");
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
        // message.error("Server Error");
        console.log("Order creation error:", err.message);
        setShowPopup(false);
      });
  };

  const handleAddressChange = (value) => {
    if (value === "add-new") {
      navigate("/address");
    } else {
      setSelectedAddress(value);
    }
  };

  //esewa form
  const buttonRef = useRef(null);
  const transactionUUID = uuidV4();
  const esewaSignature = hashValue(
    `total_amount=${total},transaction_uuid=${transactionUUID},product_code=EPAYTEST`
  );

  return (
    <>
      <form
        action='https://rc-epay.esewa.com.np/api/epay/main/v2/form'
        method='POST'
      >
        <input
          type='text'
          id='amount'
          name='amount'
          value={total}
          required
          hidden
        />
        <input
          type='text'
          id='tax_amount'
          name='tax_amount'
          value='0'
          required
          hidden
        />
        <input
          type='text'
          id='total_amount'
          name='total_amount'
          value={`${total}`}
          required
          hidden
        />
        <input
          type='text'
          id='transaction_uuid'
          name='transaction_uuid'
          value={transactionUUID}
          required
          hidden
        />
        <input
          type='text'
          id='product_code'
          name='product_code'
          value='EPAYTEST'
          required
          hidden
        />
        <input
          type='text'
          id='product_service_charge'
          name='product_service_charge'
          value='0'
          required
          hidden
        />
        <input
          type='text'
          id='product_delivery_charge'
          name='product_delivery_charge'
          value='0'
          required
          hidden
        />
        <input
          type='text'
          id='success_url'
          name='success_url'
          value='http://localhost:3000/esewa-response'
          required
          hidden
        />
        <input
          type='text'
          id='failure_url'
          name='failure_url'
          value='http://localhost:3000'
          required
          hidden
        />
        <input
          type='text'
          id='signed_field_names'
          name='signed_field_names'
          value='total_amount,transaction_uuid,product_code'
          required
          hidden
        />
        <input
          type='text'
          id='signature'
          name='signature'
          value={esewaSignature}
          required
          hidden
        />
        <input
          value='Submit'
          ref={buttonRef}
          type='submit'
          id='esewa-submit-button'
          hidden
        />
      </form>
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
                              ? `http://localhost:3006/products/${cart.productID.productImage}`
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
                        Rs.{" "}
                        {cart.productID ? cart.productID.productPrice : "N/A"}
                      </td>
                      <td className='flex '>
                        <button
                          className='btn btn-dark rounded py-0 px-1'
                          onClick={() =>
                            handleQuantityChange(cart.quantity - 1, cart)
                          }
                        >
                          -
                        </button>
                        <span className='mx-2'>{cart.quantity || 1}</span>
                        <button
                          className='btn btn-dark rounded py-0 px-1'
                          onClick={() =>
                            handleQuantityChange(cart.quantity + 1, cart)
                          }
                        >
                          +
                        </button>
                      </td>
                      <td>
                        Rs.{" "}
                        {cart.productID
                          ? (cart.quantity || 1) * cart.productID.productPrice
                          : "N/A"}
                      </td>
                      <td className='flex justify-around'>
                        <button
                          onClick={() => handleDelete(cart._id)}
                          className='btn btn-sm btn-danger'
                        >
                          <DeleteOutlineIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='summary-container mt-8'>
                <div className='summary shadow'>
                  <h4 className='summary-heading'>Order Summary</h4>
                  <div className='flex justify-between py-2 font-bold'>
                    <span>Subtotal Rs. {subtotal}</span>
                  </div>
                  <div className='flex justify-between py-2 font-bold'>
                    <span>Shipping NPR. {shipping}</span>
                  </div>
                  <div className='flex justify-between py-2 font-bold'>
                    <span>Total NPR. {total}</span>
                  </div>
                  <button
                    className='btn btn-dark mt-4 w-100'
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
                className='w-100 p-2 border rounded-md'
                required
              >
                <option value='' className='w-100'>
                  Select an address
                </option>
                {addresses.map((address, index) => (
                  <option key={index} value={address.address}>
                    {address.address}
                  </option>
                ))}

                <option value='add-new' className='w-100'>
                  + Add New Address
                </option>
              </select>
            </div>
            <div className='payment-method mb-4'>
              <h3 className='font-semibold mb-2'>Payment Method</h3>
              {/* <label className='block'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='Khalti'
                  checked={paymentMethod === "Khalti"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='mr-2'
                />
                <img
                  height={50}
                  src='data:image/png;base64,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'
                  alt=''
                />
              </label> */}
              {/* <label className='block'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='Esewa'
                  checked={paymentMethod === "Esewa"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='mr-2'
                />
                <img
                  height={70}
                  src='data:image/png;base64,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'
                  alt=''
                />
              </label> */}
              {/* <label className='block mt-2'>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='COD'
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className='mr-2'
                />
                <img
                  height={120}
                  src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAADNCAMAAAC8cX2UAAAB5lBMVEX///8IGTP3yyDxaBjKyslwdXwAFTP3yQf3yyH655/0aRcACCzf3uDJWiD8/faOk5XvyCgAABLq6urWWhDy8vMBFjHEahMhLkKfn57yZw+rjXu3ubrwXgAAADT81MEAACYAACR/OBs5RVf8rokAACr99OoAABrzlGjUfFS9tZkAADKUmp0AACAAFDUAEDUAADfT09cAAAAACzT78s+rr7d7gIv31E+pqanEpCUAGjL5xx8AGDZzQiv3ZAC+vr6JjZf76NxFT18ZKEJcZXAiLERRWGP79dz67bX78MIyPEz23HD4445zd4NZX2d8foGio6jq6tzoxEnVwXH32Wzbvl7YtiOkjSx2aSuUgCyEci64mymRezC6tKjeuSNgVy5RTC9FRTQ8OzHHuYMjITJOLjEsMjJaMy2OTymnkymXZSU1IzSOWifgpiK0SiGURCSqVB8kCy6jdSP4sxr1lh/2sSH2fhhCIi1kQC6whibgeB/YiyHElyjKeBt+USlqNC8jKTVWUzBONy37oxvVVxpXJi/bt6OnSyNqYi2zQwA8LC4iGy/yeTjzhxzfURnReEe9hW3wh1HCg0TzpH7zjl2wo4PgpIfxdifQsanDgV/xuZx5LgpQHQg6FRUkAAj8g0Lacz5HDwqdmobMkeLyAAAQAElEQVR4nO2ci1sTR7/Hs0uYjcmSjcnOITHELCFEm2Q36QrEhBIuihqhUFsRvKBVkJ7XemkReat9iz3aVtTWcixibfvW4396fjO7mws3byzknGc+zyPZmZ3dzXd+l5nZ3ehwMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDD+fyFvzpu13pFv/o7I4d5+NbF7cxJi1REdH27UTBk4lMrumJK3oHgokY4i/DoSHZVDxH7Pxg09SkLtFTe+Xl0Qbk54MPIgbqB5UwYGKw4sB0eaD2/QLs+p0IXRxKF6NrnYnwDzcKVDI1Jwc3LVh+U2aSiNfNyMEfYkOus20DuiKO+BYAw7Rf9rqD1ww2aiMwzSewc5lFea69TgnQkwy6HwVsehCMqlQYxQPLzFZ94SGtNcvBS2wxX9ILzzMKpJg/VCo8IpjZbzeo8c3bUlHGv3kvOJuaBUUnGi7uzdm8ZRydj0HjvuE7aMrqEj5KThVCqmYqXO4ntUwUrK2DzWJQg87+K3CkE43g6ndaZSJYSa6yqfi80o3Um3vMeFLRNcFu46Cmd2BqUBpAzvrNAa5ODHUWP+8UnX1qsmwofg3MXgCOISdeTmclAatVO1qTsXHESof4e1ViEXnfTTf8Im1bxLAD/3B6U8/rBuoluORemI6v/ULtWEI8TNG9VDO63WQu5V4vTLnKsYxwUJmCedQDO6IFT6w9q2qqr3WfUueqBVb7b/jAZT/YzczhJKE2tnT1aJGzs1Pj5x0FDtm5iY8Jk7Dp5+MH6GbJydmKAddKq8D9qOTYyPnz1oFCcmxowjztIGLuEA+FMdJbQghzmYnsnnKmP15Hmc0fVI8jQtnc4kI4aEyQuRiK4nPwcxkcgF0ktjSVIyu+RzPZnRk5Fx4i2kAe2Mz5MXDZcZoleTi/UR3P4RRSXpNXupbOyDqq5NTU+pmXFiwoMRxCWpCX2XdW5mRs2c4vkvtMh/kqp/6MkJ87izSV29Mj2FMNnPf6l368RbriaTp40GLjpPLe2uj1zubIwqjfAZNn3cJRzUVfVag7vh+vUC1apNcxHi2MJ4UmtytzTd4PnCV0ifhKrCDNLGTNURbb6poaFhQcV5oVD4CnM6MffXkYjp9cTLHTkP3r3TiilhqVSCkJM7Tpi29t1FyabZQuGme5YUH2SmmlDklODiJ6dU7OPnbkH11YxKfftqUr1oHHUmguZ/JkfdR1wGdkS4bg7MXfindtGMfWEXTAeDzXi3//Vfyn6cUpBEm3jOyloTSf1LavgCSVNnIplvbmv6Wai5o2J09/SYQH1be3AQ+IeuG/Hvu6gmr9KtFQ1HSANuulv7XpjT9XErTQ6RobuE62SiJtIck7VkF6ZQcrKS3HDyAn9bpd/91jzoTmZAZ2EecVhPQjBzpgt/m9HOG0HyLx3d5fl5fCWgQgB8E8mY4wGVLQdjOOHcacVVOC3Z3+rocmUku5CcmhRuY6rp51++mFK5PHTKXIbLzxOwepkeVvhOg0TmIu4ByW5CmEsmz7oX8tr577S7Vh8asg8p9TNPA5w5U/YNDXzTUn0qgi9///1/cSrJToWfW9xNHI5MCl9H8EKL291yTdMfQNC7+NkfMM16kAB0FHHxX2e0g/fua5zKaeetc5HYdkjBkboIbYusmdIK1zScN8IVXDyDVQ1Gaqx+7qMV90KPwIWFGRQ5UwC+U6lYqP8B0fAXSIzD+LWA8nzBvYA4zhjnqGyy/BRtuW21Pt69QHtNaQ0/7jEGsEKTmtfPHxw7czHv4i9q6k/Xrt34aQpd9sHwdXrSN+7JnOFnI1inbb9Cdw0fuXddRfrE2NipvJb8QuBnk8kHUAnmxvlynhDaN/uOW8/eUAvhqVlqWZeGxX8Z3y40rcF3z0R0bfJsRv/yJrByBeV9p5IY5m168gue/yZi5K9vk1Y8zAam1O5IJJnUdDLYf5OEznG5wNzahXKa8Hm3VXVfi7uB0PKiurSGxcUC/XY33TOqqqLu1ptjGf0hTcI357XI2K1WqNUeXYNR+yPd8O3vkhnThV23AtPkKHUhQAb7j5JJ4gU3m7TMRHlFQkLbUfwwtj2q/b/3GLpCj6G7/ftD66tuaFq8YyroCTQ13Q/d5G/fD8wZPfHL/Tu+n3saoPoW9E3hl8Bt6uO/3L9tzeML1lEuYwcdwwuhQKBQ4+N+mK1sz7Ad3h8y7BtagQvnnmwkO2CZm5+9d/PenIsv3JubNTXN3Zs1qmmFtaPSoOool7HDONXs3FxZNV2JjCg4vi2qHcFfLWsvwbiZskrrmduIbhe1oGHG1ZtvjmvVZxeJbDGG4r3bIzsXfBxyA6GWvaQTzJJBtWo3RPfVt5P2NpB1iCOloO2akcOc+8kKyHq8t7pEWWkIVSl3B+zTLRwjFxdLarRze1STJVZKkiTrpYKwVCEY/LWh2uJ26RZc1NaOxjj2bN9sxS9ms6JcKUGRIjqDqT2rdd8pvF7G26ruos+DHDmlTp7+yblU7YAWaFpsurp1D4KIZmHyqHGxrIqVOrlv6k/9XiPbTQzedOdqoQBD0VuzRrPL13XyAzOHySNKvFQvi6/cqumLm1p8cfE/3o3//qCWc85y4i5Kg4N1s/jKrR2/ifJ3xilmRQP49FcbVwzmrOLRz4aGdh3Y5pVJNX0v15+0ud+R0N99G16r3AefGE++XZ8dtV95X9s+gxftlYrf3BtNVd+VUOg38zpP+8wrv7Aq9hplUTLeGoBs5zKe+dsHLD5DBi2Pqe4+WI32bLVoQ7h5HTordHh/g8uYFXQJCDOmV8vLl06e8JHbEvwuO5ej/pWKQrrw9q9ssP7cQv0NpH+ftZQr3D2GoxXD4RzMoIKXTlQN6nYg76lagLhXoCa44YpkDe8a5+4eMHfxcVVFy97KN/I7c1Jq+QR5wHjMLtnOPVXuHALZWenNZMN3hWX0OxJ4ns2OPFlVYUKGMhGEX/KZN9nsoAjrrrKUljbyAs3jN4hrdyhwfXqKQ+8I9sTjak0NVBh4BmLDTjKoSa+IwW3SnZX2NJiJxd2y5CXZNFjOPaGNojwUWKBvynI2gFFUKXWQlVGQ6D5gj+6cFPx9P+XJM29txf4nK+sbPnQ9j+xQXAYp/SJZCYNum24vysVgyqBo1pQrpFRw/ftrM6otdq7GwxWJbh8vHLdF9mY9Atd9vMbP3Q3zqt2iARwNw2R9mbfNzTfBKf262tzuhhl7Hbys25N15HpPCuTVlu1mdO19xVZtW1RDgJdkf+qVbyfMHV4d3O7Fag83f/VRWyLlcmWebMG/fLlJpZ25hUhTVD6icj6l11Hs/VQwX23ZTp6vVh2YqcpmuDlGGEhEaWkgZlBCuBSLGS3yUEaHY7E8PczDxfqbVbNZbABxtHk8gRCc6TAJHhyFGqsDNL+cemW92mIr7dX0vVjj4tXGxmnz5qO/Mw32Kj/U6Iw+hLo01TkCCWI3+UN6RotBvfLQbCY3K+YL29nSI1I5gDmkwSJ00EoeYO5w7wn7vfzFmsd+q43d2l2Rrb4sr4pHFc6zYhX0v9rIjW/iun/AXHv4jyVQ5oHSn9C+mew0xCYW+6zN6R7YPORB/yYf0XK/xmS/BF6+y27V643SNZE9XZGNr+wjT0l7VsgyooR+eEpO0NMTSnt+gpp+YjK9qd0hl1r/hskf+YXYjw5Hr0J2LvX09NyIcy+9sMrtgePkAbL0HFUS8LczXenYtOgYXRZsHrqdG05GLQKL+UpoU1M2KleaWvrARHEiZzAOKawbNXkd/gTtmN/AksrCSrtD5HD8dyjsVgOgMpGHdrSjOtKtK7JD1H8Cjyju/hW0765KmekOR/iVS+iyU7V/z+tUuwOLVWO21tQH8Ylwnqwah6MBr0NWPCQjPwKxHdTH/wTr9UanYTUtGy7OoUf7iFYE59FoRyn/Qywc/6jH6xA/gqGjWjUJbicMYbY+/3YGG16ju0Y2VZcFo2qBPvDpeZDjkGXQawR0nHQMCd5+9WELCB4gLj4cpTtJu2EPgtTgHxw8B2aO4ynSd33gDdWquXgnudHE87bKTu3f6MH+erJNU3LdGELUz/1h3BcCORoJaDL45rmXENTx/BSJgjw4cDgBfWSkQXkA0Y4C2nNxzOkBcmdHVGon+9FtkO2XUvsra851CSxWhfa1Ppq4EPHSVBTkeJeWlj4GL18yvIDDM5C0R9McagBL/rPP4ffgvAfSW9/S0v6YB5GO6oNOeL4bTqpeX6F9wdXK7oWFt4932aiazMBTwT2b87yc0jA1ZRrjNJjRz3FE67/nH3qw2kq8QAFzqzdI8Ho4NQA1L+gmojv/mn/kMVLDCnmy3gxi0QKJ+UStak7pcIivXLytKQ1UFMOvI2bZo5sOzmnPQC+ksv64odXjUTmVBDRthknwdmMIcTpUg92NaO/WNUh9NDX8GWoncQHWJjF/yLNKdiLryC7zO7EYqUEMj1jfDJE8LGazMKvy90epHPK8VOyPk2mLKIr+zr/20XAGq9O4hQjmNLKTNMuqNDU8IpmsqHBGzEdXLeNxs+xwXtqJSXktcnjUmkKhl2Zd+49THlwuOeIz1iysn2Z0YsnrYFhHzGNGO8WZvtEHTWgmk5th0FsidauMTZ70d5wwn/zvJOFwv+Hl3fMrbYSn+1sVSGsLf9NS27Ph+LV9xmanJ/C0TYJ5NgT0StszOuXUrJ3P+3Gg7Vlnt3rd3fas9zAkhKW254OrF/JRmOWfg5Xn9r62tg6iZW78sJXyg4fcYMLTRql1IY4+MjfjHGylyYoTz7e2zsSpi1g75z1T8DfKYfKRxlz3DNStXshHh+GCl3bkPsNqwmEz72CEkIqQtUaETfLSHcnJKoVsWbsxsm6+IWTsxvR48zTY+Fx9fw5zIsT95I77uHdoyCvmws3bdFNJCUPYX7Lt3ukbc5Tk1GI4ty26sUJeU3P67Hsy8oYUl+nd+jDoXj2+2qGa/HraD2nc5rnKayG3MXnXEdDdMajYfKM8OkB/BEh+Y2nzc+7XIkrBSZ73HXE4c+HekrImBW0ZyBMdpu+y7LLvIdhbUJRg7cu7DsAwFs5JgwNK1GMDSry5kf5Uxjsk8Ds+QSPkUsvkVasjxuw9N9rZuPUMSx3GrcgjXXWimuh+5RMEGm2ymHXaQPmlSG/9qKaPQ09uS7TJ53ihDuLaIiwZLugdOn70wBEvnUl435eq83uPHDi2q8t3NCstn/xkJwRuzlGhIMBwxoNBjr/Dy5i1+Mr327tcLvqCVpccHK2bFxMrFF8Zv8WHZcIn7//icdmbPxCMd3DryL1rCEuvLp08MenzHRClT33vS5fp5s7ekz7f5IlPl+vQ0BQ5HJR6JUnyO/zSe1P+L9aytDharFfVFFmkg41ffF8qp/TXvoPLYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaD8X+J/wXAUCWzji2dpgAAAABJRU5ErkJggg=='
                  alt=''
                />
              </label> */}
              <div className='d-flex flex-row justify-content-start gap-3 '>
                <label className='p-0 w-full'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    className='card-input-element p-0 w-fit'
                    onChange={() => {
                      setPaymentMethod("Esewa");
                    }}
                  />
                  <div className='card card-default card-input '>
                    <img
                      height={50}
                      src='data:image/png;base64,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'
                      alt={"esewa"}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </label>
                <label className='p-0'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    className='card-input-element w-fit p-0'
                    onChange={() => {
                      setPaymentMethod("Khalti");
                    }}
                  />
                  <div className='card card-default card-input '>
                    <img
                      height={50}
                      src='data:image/png;base64,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'
                      alt={"khalti"}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </label>
                <label className='p-0'>
                  <input
                    type='radio'
                    name='paymentMethod'
                    className='card-input-element w-fit p-0'
                    onChange={() => {
                      setPaymentMethod("COD");
                    }}
                  />
                  <div className='card card-default card-input '>
                    <img
                      height={50}
                      className='w-fit'
                      src='data:image/png;base64,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'
                      alt={"COD"}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </label>
              </div>
            </div>
            <div className='text-center'>
              <button
                className='continue-btn text-white py-2 px-4 rounded-md'
                style={{ backgroundColor: "#111" }}
                onClick={handleConfirmOrder}
                disabled={!paymentMethod}
              >
                {paymentMethod
                  ? "Continue to Order"
                  : "Select a Payment Method to Continue"}
              </button>
              <button
                className='continue-btn text-white py-2 px-4 rounded-md mt-3'
                style={{ backgroundColor: "#111" }}
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
