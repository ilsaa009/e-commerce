import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ITEMS: [],
  TOTAL_PRICE: 0,
};

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
      },
      
    removeFromCart: (state, action) => {
      const itemToRemove = state.ITEMS.find(item => item.id === action.payload);
      if (itemToRemove) {
        state.TOTAL_PRICE -= itemToRemove.price * itemToRemove.quantity;
        state.ITEMS = state.ITEMS.filter(item => item.id !== action.payload);
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.ITEMS.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        state.TOTAL_PRICE += item.price;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.ITEMS.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.TOTAL_PRICE -= item.price;
      }
    },
  },
});

export const { addtoCart, removeFromCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;
