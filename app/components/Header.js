'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Drawer from 'react-modern-drawer';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import 'react-modern-drawer/dist/index.css';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import LogoImg from '../assests/common/logo.png';
import {
  addtoCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from '../redux/cartSlice';
import { Badges } from './Custom';

const Header = () => {
  const dispatch = useDispatch();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState(null); 

  const cartItems = useSelector((state) => state.cart.ITEMS);
  const totalPrice = useSelector((state) => state.cart.TOTAL_PRICE);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const items = ['Makeup', 'Food', 'Fruits', 'Vegetables', 'Juice', 'Furniture'];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log('User is logged in:', currentUser); 
      } else {
        setUser(null);
        console.log('No user is logged in.'); 
      }
    });

    return () => unsubscribe(); 
  }, []);

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

  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    window.location.href = '/login';
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

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      const parsedItems = JSON.parse(storedCart);
      parsedItems.forEach((item) =>
        dispatch(addtoCart({ ...item, quantity: item.quantity }))
      );
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartTotalPrice', totalPrice);
  }, [cartItems, totalPrice]);

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
            {!isLoggedIn ? (
              <div className="flex items-center space-x-1 text-right text-sm mx-2">
                <span
                  onClick={() => window.location.href = '/login'}
                  className="cursor-pointer hover:text-blue-500 transition-colors"
                >
                  LogIn
                </span>
                <span className="text-gray-500">/</span>
                <span
                  onClick={() => window.location.href = '/signup'}
                  className="cursor-pointer hover:text-blue-500 transition-colors"
                >
                  SignUp
                </span>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-blue-500 transition-colors"
              >
                Log Out
              </button>
            )}
            <IoSearchOutline size={23} onClick={toggleSearchBar} className="cursor-pointer" />
            <FaRegHeart size={23} />
            <div className="relative">
              <IoCartOutline size={23} onClick={toggleCartDrawer} className="cursor-pointer" />
              <div className="absolute -top-2 -right-1.5">
                <Badges color="bg-primary-green">{cartItems.length}</Badges>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Search Bar */}
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
            <button onClick={toggleSearchBar} className="text-gray-500 text-xl">
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

      {/* Cart Drawer */}
      <Drawer open={isCartVisible} onClose={toggleCartDrawer} direction="right" size="400px">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">YOUR CART</h2>
            <button className="text-gray-500 text-xl" onClick={toggleCartDrawer}>
              &times;
            </button>
          </div>
          <div className="cart-items flex-grow">
            {isLoggedIn ? (
              <>
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
                <div className="mt-6">
                  <div className="flex justify-between items-center">
                    <span>Total:</span>
                    <span className="font-bold">
                      ${Math.round(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100}
                    </span>
                  </div>
                  <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mt-4">
                    Go to Checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="bg-green-500 text-white py-2 px-4 rounded-md w-full"
                >
                  Please log in to view your cart
                </button>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
