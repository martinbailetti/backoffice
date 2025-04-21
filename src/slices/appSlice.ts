import { GenericRecord } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
interface AppState {
  flashMessage: GenericRecord; // Flash message
  login_redirect: string; // Redirect after login
  createFactoryDeviceModal: boolean; // Show modal on true
}
const initialState: AppState = {
  flashMessage: {type: "secondary", message: ""},
  createFactoryDeviceModal: false,
  login_redirect: "",
};
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setFlashMessage: (state, action) => {
      state.flashMessage = action.payload;
    },
    setLoginRedirect: (state, action) => {
      state.login_redirect = action.payload;
    },
    setCreateFactoryDeviceModal: (state, action) => {
      state.createFactoryDeviceModal = action.payload;
    },
  },
});

export const { setFlashMessage, setLoginRedirect, setCreateFactoryDeviceModal } = appSlice.actions;

export default appSlice.reducer;
