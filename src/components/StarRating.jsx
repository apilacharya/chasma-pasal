import React from 'react';
import './StarRating.css'; // Import custom CSS for styling

const StarRating = ({ rating, onRatingChange }) => {
    const handleClick = (index) => {
        onRatingChange(index + 1);
    };

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                return (
                    <span
                        key={index}
                        className={index < rating ? "star filled" : "star"}
                        onClick={() => handleClick(index)}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

export default StarRating;
