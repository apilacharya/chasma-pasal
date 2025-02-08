import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCartApi } from "../apis/api";

import "./ProductCard.css"; // Make sure to create and import this CSS file

const ProductCard = ({ productInformation }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
    );
  };

  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("userData"));

  const handleCartButton = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userID", user._id);
    formData.append("productID", productInformation._id);
    formData.append("productPrice", productInformation.productPrice);
    formData.append("quantity", quantity);

    addToCartApi(formData)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        toast.error("Server Error");
        console.log(err.message);
      });
  };

  return (
    <a
      href={`/product/${productInformation._id}`}
      className='text-decoration-none'
    >
      <div
        className='product-card w-100 h-100 row border-0 p-0'
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          className=' col-12 p-0'
          style={{ maxHeight: "200px", minHeight: "200px" }}
        >
          <img
            className='h-100 w-100'
            style={{ objectFit: "cover" }}
            src={`http://localhost:3006/products/${productInformation.productImage}`}
            alt={productInformation.productName}
          />
        </div>
        <div className='col-12 mt-3'>
          <h5 className='text-truncate text-black text-xl'>
            {productInformation.productName}
          </h5>
          {/* <p
            style={{
              fontSize: "0.9rem",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {productInformation.productDescription}
          </p> */}

          <p
            className='m-0 p-0 text-success mt-4 mb-3 font-bold'
            style={{ fontSize: "1.3rem" }}
          >
            Rs. {productInformation.productPrice}
          </p>
          {/* <div className='row'>
            <div className='quantity-control d-flex flex-column col-6'>
              <div
                className='buttons d-flex align-items-center justify-content-beween'
                style={{ fontSize: "0.8rem" }}
              >
                <button onClick={decreaseQuantity} className='m-0 p-0 bg-white'>
                  <FaMinus />
                </button>
                <span>{quantity}</span>
                <button onClick={increaseQuantity} className='m-0 p-0 bg-white'>
                  <FaPlus />
                </button>{" "}
              </div>
              <span className='text-secondary' style={{ fontSize: "0.7rem" }}>
                Quantity
              </span>
            </div>
            <div className='price col-6 d-flex flex-column'>
              <span className='text-secondary' style={{ fontSize: "0.7rem" }}>
                Price
              </span>
            </div>
          </div> */}
          {/* <button
            onClick={handleCartButton}
            className='add-to-cart-btn '
            style={{ backgroundColor: "#89938c" }}
          >
            Add to Cart
          </button> */}
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
