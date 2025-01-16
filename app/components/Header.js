'use client'

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LogoImg from "../assests/common/logo.png";
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import Drawer from 'react-modern-drawer';
import { FaRegHeart } from 'react-icons/fa';
import 'react-modern-drawer/dist/index.css';
import Image from 'next/image';
import { addtoCart, removeFromCart, incrementQuantity, decrementQuantity } from '../redux/cartSlice';

const Header = () => {
  const dispatch = useDispatch();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState('');

  const cartItems = useSelector(state => state.cart.ITEMS);
  const totalPrice = useSelector(state => state.cart.TOTAL_PRICE);

  const items = ['Makeup', 'Food', 'Fruits', 'Vegetables', 'Juice', 'Furniture'];

  const toggleCartDrawer = () => setIsCartVisible((prev) => !prev);
  const toggleSearchBar = () => {
    setIsSearchVisible((prev) => !prev);
    setSearchResults([]);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = items.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddToCart = (item) => {
    dispatch(addtoCart(item));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  return (
    <>
      <header className="header px-12 py-3 bg-white-100 relative z-20">
        <nav className="p-4 flex justify-between items-center relative">
        <div className="flex items-center gap-14">
        <div>
      <Image src={LogoImg} alt="Logo" className="h-7" width={150} height={150} />
          </div>
            <ul className="flex space-x-8 text-gray-600">
              <li><a href="#" className="hover:text-blue-500">HOME</a></li>
              <li><a href="#" className="hover:text-blue-500">ABOUT</a></li>
              <li><a href="#" className="hover:text-blue-500">SERVICES</a></li>
              <li><a href="#" className="hover:text-blue-500">CONTACT</a></li>
            </ul>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <IoSearchOutline size={23} onClick={toggleSearchBar} className="cursor-pointer" />
              <FaRegHeart size={23} />
              <div className="relative">
                <IoCartOutline size={23} onClick={toggleCartDrawer} className="cursor-pointer"/>
                <div className="absolute -top-2 -right-1.5 bg-primary-green w-[18px] h-[18px] rounded-full text-[12px] flex justify-center text-white">
                  {cartItems.length}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {isSearchVisible && (
        <div className="absolute top-0 left-0 w-full bg-white shadow-md p-4 z-30">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Search
            </button>
            <button
              onClick={toggleSearchBar}
              className="text-gray-500 text-xl"
            >
              &times;
            </button>
          </div>
          <div className="mt-4">
            {searchResults.length > 0 ? (
              <ul className="space-y-2">
                {searchResults.map((result, index) => (
                  <li key={index} className="border-b py-2 flex justify-between">
                    {result}
                    <button
                      onClick={() => handleAddToCart({ id: result, title: result, price: 10 })}
                      className="bg-green-500 text-white py-1 px-3 rounded-md"
                    >
                      Add to Cart
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No results found</p>
            )}
          </div>
        </div>
      )}

      <Drawer open={isCartVisible} onClose={toggleCartDrawer} direction="right" size="400px">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">YOUR CART</h2>
            <button className="text-gray-500 text-xl" onClick={toggleCartDrawer}>
              &times;
            </button>
          </div>
          <div className="cart-items flex-grow">
            {cartItems.length > 0 ? (
              <ul className="space-y-2">
                {cartItems.map((item, index) => (
                  <li key={index} className="border-b py-2 flex justify-between items-center">
                    <span>{item.title} - ${item.price} x {item.quantity}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecrement(item.id)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded-md"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleIncrement(item.id)}
                        className="bg-blue-500 text-white py-1 px-3 rounded-md"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Items</p>
            )}
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <span>Total:</span>
              <span className="font-bold">${totalPrice}</span>
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mt-4">
              Go to Checkout
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;