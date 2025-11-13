import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  userId: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
}

// Dummy user data - initialized in the store
const INITIAL_USER: User = {
  userId: 'user-12345',
  name: 'Vishnu Mohan',
  email: 'vishnu.mohan@example.com'
};

const initialState: UserState = {
  user: INITIAL_USER,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

