import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchCart, 
  addToCartAPI, 
  updateCartItemAPI, 
  removeFromCartAPI 
} from '../../services/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cartItems = await fetchCart();
      return cartItems;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const cartItem = await addToCartAPI(productId, quantity);
      return cartItem;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue }) => {
    try {
      const cartItem = await updateCartItemAPI(productId, quantity);
      return { productId, cartItem };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update cart item');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId: number, { rejectWithValue }) => {
    try {
      await removeFromCartAPI(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove from cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCartOptimistic: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    updateQuantityOptimistic: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    removeFromCartOptimistic: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const existingItemIndex = state.items.findIndex(
          item => item.product.id === action.payload.product.id
        );
        if (existingItemIndex >= 0) {
          state.items[existingItemIndex] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateCartItemAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        const { productId, cartItem } = action.payload;
        if (cartItem === null) {
          state.items = state.items.filter(item => item.product.id !== productId);
        } else {
          const existingItemIndex = state.items.findIndex(item => item.product.id === productId);
          if (existingItemIndex >= 0) {
            state.items[existingItemIndex] = cartItem;
          }
        }
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeFromCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product.id !== action.payload);
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCart, 
  addToCartOptimistic, 
  updateQuantityOptimistic, 
  removeFromCartOptimistic, 
  clearCart 
} = cartSlice.actions;

export const addToCart = addToCartOptimistic;
export const updateQuantity = updateQuantityOptimistic;
export const removeFromCart = removeFromCartOptimistic;
export const loadCart = setCart;

export default cartSlice.reducer;

