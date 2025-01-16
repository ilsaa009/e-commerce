import React from 'react'
import Stars from './Stars'

const Reviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews available.</p>;
  }
  return (
    <div>
    {reviews.map((review, index) => (
      <div key={index} className="review bg-gray-100 p-4 mb-4 rounded-md">
        <b><h2>{review.reviewerName}</h2></b>
        <p>Comment: {review.comment}</p>
        <Stars rating={review.rating} />
      </div>
    ))}
  </div>
  )
}

export default Reviews
