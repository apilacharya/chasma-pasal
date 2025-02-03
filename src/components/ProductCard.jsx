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
    <a href={`/product/${productInformation._id}`}>
      <div
        className="product-card w-100 h-100 row "
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          className="col-12 "
          style={{ height: "200px", overflow: "hidden" }}
        >
          <img
            style={{
              objectFit: "cover",
              height: "100%",
              width: "100%",
            }}
            src={`http://localhost:3006/products/${productInformation.productImage}`}
            alt={productInformation.productName}
          />
        </div>
        <div className=" col-12">
          <h5 style={{ textDecoration: "none", color: "black" }}>
            {productInformation.productName}
          </h5>

          <div
            className=" text-center w-100 p-0"
            style={{
              backgroundColor: "#5e6560",
              transform: "rotate(-40deg)",
              position: "absolute",
              top: "20px",
              left: "-40%",
            }}
          >
            <p className="text-white p-0 m-0" style={{ fontSize: "0.8rem" }}>
              {productInformation.productCategory}
            </p>
          </div>
          <div className="row">
            <div className="price col-6 d-flex flex-column">
              <p
                className="price-text m-0 p-0 "
                style={{ color: "green" }}
              >
                NPR.{productInformation.productPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;
