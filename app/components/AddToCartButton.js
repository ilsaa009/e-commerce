"use client";

import { useDispatch, useSelector } from "react-redux";
import { addtoCart } from "../redux/cartSlice"; 

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.ITEMS || []); 

  const isProductInCart = (id) => {
    return cart.some((item) => item.id === id);
  }

  const handleAddToCart = () => {
    if (!isProductInCart(product.id)) {
      dispatch(addtoCart(product));
    }
  };

  const buttonDisabled = isProductInCart(product.id);

  return (
    <button
      onClick={handleAddToCart}
      disabled={buttonDisabled} 
      className={`mt-4 py-2 px-4 rounded-md ${
        buttonDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      } text-white`}
    >
      {buttonDisabled ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
}
