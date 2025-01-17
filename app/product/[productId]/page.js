import { notFound } from "next/navigation";
import axios from "axios";
import Stars from "../../components/Stars";
import Reviews from "../../components/Reviews";
import AddToCartButton from "../../components/AddToCartButton";
import BackButton from "../../components/BackButton";

const SkeletonLoader = ({ type }) => {
  if (type === "image") {
    return <div className="bg-gray-300 h-80 mb-4 animate-pulse"></div>;
  } else if (type === "text") {
    return <div className="bg-gray-300 h-4 mb-4 animate-pulse"></div>;
  } else if (type === "rating") {
    return <div className="bg-gray-300 h-10 w-1/3 animate-pulse mb-4"></div>;
  }
  return null;
};

async function fetchProductById(productId) {
  try {
    const response = await axios.get(`https://dummyjson.com/products/${productId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function ProductDescription({ params }) {
  const { productId } = params;
  const currentProduct = await fetchProductById(productId);

  if (!currentProduct) {
    notFound();
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const getRatingDistribution = (reviews) => {
    const distribution = [0, 0, 0, 0, 0];
    if (reviews) {
      reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating - 1] += 1;
        }
      });
    }
    return distribution.reverse();
  };

  return (
    <div className="product-description-page px-6 py-4">
        <head>
        <title>{currentProduct.title}</title>
        <meta name="description" content={currentProduct.description} />
      </head>
      <BackButton/>
      <div className="flex gap-6">
        <div className="product-images w-1/3">
          <div
            className="main-image bg-gray-100 h-80 mb-4"
            style={{
              backgroundImage: currentProduct ? `url(${currentProduct.thumbnail})` : "none",
            }}
          >
            {!currentProduct && <SkeletonLoader type="image" />}
          </div>
        </div>

        <div className="product-details w-2/3">
          <div className="product-description bg-gray-100 p-4 mb-4">
            {currentProduct ? (
              <p>{currentProduct.description}</p>
            ) : (
              <SkeletonLoader type="text" />
            )}
          </div>
          <div className="product-description bg-gray-100 p-4 mb-4">
            {currentProduct ? (
              <>
                <p>Brand: {currentProduct.brand}</p>
                <p>Stock: {currentProduct.stock}</p>
                <p>Warranty: {currentProduct.warrantyInformation}</p>
                <p>Shipping: {currentProduct.shippingInformation}</p>
                <p>Category: {currentProduct.category}</p>
                <p>Availability: {currentProduct.availabilityStatus}</p>
                <p>Return Policy: {currentProduct.returnPolicy}</p>
                <p>Minimum Orders: {currentProduct.minimumOrderQuantity}</p>
              </>
            ) : (
              <>
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
                <SkeletonLoader type="text" />
              </>
            )}
          </div>
          {currentProduct && <AddToCartButton product={currentProduct} />}
        </div>
      </div>
      <div className="ratings-overview bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="average-rating text-center">
            {currentProduct ? (
              <>
                <h2 className="text-4xl font-bold">
                  {calculateAverageRating(currentProduct.reviews)}/5
                </h2>
                <Stars rating={Math.round(calculateAverageRating(currentProduct.reviews))} />
                <p className="text-gray-600">{currentProduct.reviews?.length || 0} ⭐ Ratings</p>
              </>
            ) : (
              <>
                <SkeletonLoader type="rating" />
                <SkeletonLoader type="rating" />
              </>
            )}
          </div>

          <div className="rating-distribution w-full">
            {currentProduct
              ? getRatingDistribution(currentProduct.reviews).map((count, index) => (
                  <div key={5 - index} className="flex items-center mb-2">
                    <span className="text-sm font-medium w-10 text-right">
                      {5 - index} ⭐
                    </span>
                    <div className="w-full bg-gray-300 h-2 mx-2 rounded">
                      <div
                        className="bg-yellow-500 h-2 rounded"
                        style={{
                          width: `${(count / currentProduct.reviews.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                ))
              : Array(5)
                  .fill(null)
                  .map((_, index) => <SkeletonLoader key={index} type="text" />)}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {currentProduct ? (
          <Reviews reviews={currentProduct.reviews} />
        ) : (
          <SkeletonLoader type="text" />
        )}
      </div>
    </div>
  );
}
