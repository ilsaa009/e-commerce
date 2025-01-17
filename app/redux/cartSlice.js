import { createSlice } from '@reduxjs/toolkit';

const localStorageKey = 'cartState';


const loadState = () => {
  try {
    const serializedState = localStorage.getItem(localStorageKey);
    return serializedState ? JSON.parse(serializedState) : { ITEMS: [], TOTAL_PRICE: 0 };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return { ITEMS: [], TOTAL_PRICE: 0 };
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(localStorageKey, serializedState);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

const initialState = loadState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addtoCart: (state, action) => {
      if (!action.payload || !action.payload.id || !action.payload.price) return;
      const existingItem = state.ITEMS.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.ITEMS.push({ ...action.payload, quantity: 1 });
      }
      state.TOTAL_PRICE += action.payload.price;
      saveState(state); 
    },
    removeFromCart: (state, action) => {
      const itemToRemove = state.ITEMS.find(item => item.id === action.payload);
      if (itemToRemove) {
        state.TOTAL_PRICE -= itemToRemove.price * itemToRemove.quantity;
        state.ITEMS = state.ITEMS.filter(item => item.id !== action.payload);
        saveState(state); // Save state to localStorage
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.ITEMS.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.TOTAL_PRICE += item.price;
        saveState(state);
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.ITEMS.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.TOTAL_PRICE -= item.price;
        saveState(state); 
      }
    },
  },
});

export const { addtoCart, removeFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
