import React from 'react'

const Stars = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="stars flex">
      {[...Array(totalStars)].map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <i className="fas fa-star text-yellow-500"></i> 
          ) : (
            <i className="far fa-star text-gray-400"></i> 
          )}
        </span>
      ))}
    </div>
  );
};
export default Stars
