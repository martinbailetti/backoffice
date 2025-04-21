import { GenericRecord } from "@/types";

import { createSlice } from "@reduxjs/toolkit";
interface PageState {
  permission: string | null; // Page access permission
  status: string; // Page status: pending, prepared, ready
  title: string; // Page title
  titleStyle: GenericRecord | null; // Page title
  subtitle?: string; // Page subtitle

  breadcrumb: GenericRecord[];
  error: string | ""; // Error message,

  createPath: GenericRecord | null;
  infoPath: string | null;
  exportApiFunction: string | null;

}
const initialState: PageState = {
  title: "",
  titleStyle: null,
  subtitle: "",
  permission: null,
  status: "pending",
  breadcrumb: [],
  error: "",
  createPath: null,
  infoPath: null,
  exportApiFunction: null,
};
export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.title = action.payload.title ?? initialState.title;
      state.titleStyle = action.payload.titleStyle ?? null;
      state.subtitle = action.payload.subtitle ?? initialState.subtitle;

      state.status = action.payload.status ?? "ready";
      state.breadcrumb = action.payload.breadcrumb ?? initialState.breadcrumb;
      state.permission = action.payload.permission ?? initialState.permission;

      state.infoPath = action.payload.infoPath ?? initialState.infoPath;
      state.createPath = action.payload.createPath ?? initialState.createPath;
      state.exportApiFunction = action.payload.exportApiFunction ?? initialState.exportApiFunction;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setPage,
  setStatus,
  setError,
} = pageSlice.actions;

export default pageSlice.reducer;
