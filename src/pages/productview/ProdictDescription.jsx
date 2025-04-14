import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addToCartApi,
  createReviewApi,
  getReviewsByProductID,
  getSingleProduct,
  getUserDataById,
} from "../../apis/api";
import FooterCard from "../../components/FooterCard";
import StarRating from "../../components/StarRating";
import "./ProductDescription.css";

const ProductDescription = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("userData"));

  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [productPrice] = useState(0);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
    );
  };

  const handleAddToCart = () => {
    const formData = new FormData();
    formData.append("userID", user._id);
    formData.append("productID", id);
    formData.append("productPrice", productPrice);
    formData.append("quantity", quantity);

    addToCartApi(formData)
      .then((res) => {
        if (res.data.success) {
          toast.success("Item added to cart successfully!");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error("Server Error");
        console.error(err.message);
      });
  };

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          getSingleProduct(id),
          getReviewsByProductID(id),
        ]);

        const productData = productRes.data.data;
        setProduct(productData);

        const reviewsData = reviewsRes.data.review || [];
        const reviewsWithUserData = await Promise.all(
          reviewsData.map(async (review) => {
            const userRes = await getUserDataById(review.userID);
            return { ...review, user: userRes.data.user };
          })
        );

        setReviews(reviewsWithUserData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product details or reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    const formData = new FormData();
    formData.append("userID", user.id);
    formData.append("productID", id);
    formData.append("review", review);
    formData.append("rating", rating);

    try {
      const res = await createReviewApi(formData);
      if (res.data.success) {
        toast.success(res.data.message);
        const newReview = {
          userID: user.id,
          rating,
          review,
          user: user, // Add user information
        };
        setReviews((prevReviews) => [...prevReviews, newReview]);
        setReview("");
        setRating(0);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Server Error");
      console.error(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container product-description position-relative">
        <div className="product-details">
          <div className="image-section">
            <img
              src={`http://localhost:3006/products/${product.productImage}`}
              alt={product.productName}
            />
          </div>
          <div className="product-info">
            <h1 className="text-black">
              <b style={{ fontSize: "2rem", fontWeight: "500" }}>
                {product.productName}
              </b>
            </h1>
            <div className="price-category">
              <h3 className="font-bold text-xl">Rs.{product.productPrice}</h3>
            </div>
            <div
              className="position-absolute bg-black rounded text-white px-2 d-flex justify-content-center align-items-center"
              style={{ top: "30px", right: "30px", fontSize: "0.9rem" }}
            >
              {product.productCategory}
            </div>
            <div className="quantity-control">
              <span>Qty:</span>
              <button
                onClick={decreaseQuantity}
                className="quantity-btn text-white font-bold mx-2 rounded"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="quantity-btn text-white font-bold  mx-2 rounded"
              >
                +
              </button>
            </div>
            <div className="description mt-4">
              <h5>Description:</h5>
              <p>{product.productDescription}</p>
            </div>
            <div className="buttons">
              <button
                onClick={handleAddToCart}
                className="btn-add-to-cart btn btn-sm"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <form className="review-form mt-3" onSubmit={handleReviewSubmit}>
            <h3 style={{ fontSize: "1.8rem", fontWeight: "500" }}>
              Your Review:
            </h3>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <div className="rating-stars">
              <StarRating rating={rating} onRatingChange={handleRatingChange} />
            </div>
            <button type="submit">Submit Review</button>
          </form>

          <div className="mt-5">
            <h3>Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="review-item">
                  <StarRating rating={review.rating} />
                  <p className="review-text">{review.review}</p>
                  <p className="review-author">- {review.user.fullname}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <FooterCard />
    </>
  );
};

export default ProductDescription;
