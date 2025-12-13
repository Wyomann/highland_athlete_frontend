import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, UnknownAction } from "@reduxjs/toolkit";
import type { Dispatch } from "redux";

interface User {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

interface AuthenticationState {
  user: User | null;
}

const initialState: AuthenticationState = {
  user: null,
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    _setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const { _setUser } = authenticationSlice.actions;

export const fetchUser = async (dispatch: Dispatch<UnknownAction>) => {
  try {
    const response = await fetch('/api/auth/user');
    const data = await response.json();
    dispatch(_setUser(data.user));
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

export default authenticationSlice.reducer;

