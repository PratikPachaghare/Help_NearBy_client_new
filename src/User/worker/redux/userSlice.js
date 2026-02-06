import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userData: {},
  isWorker:false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    isWorkers(state, action) {
      state.isWorker = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = {};
    }
  }
});

export const { login, logout,isWorkers } = userSlice.actions;
export default userSlice.reducer;
