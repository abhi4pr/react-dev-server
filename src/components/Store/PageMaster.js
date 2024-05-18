import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAddModal: false,
};

const pageMasterSlice = createSlice({
  name: "pageMaster",
  initialState,
  reducers: {
    setOpenShowAddModal(state) {
      state.showAddModal = true;
    },
    setCloseShowAddModal(state) {
      state.showAddModal = false;
    },
  },
});
export const { setOpenShowAddModal, setCloseShowAddModal } =
  pageMasterSlice.actions;
export default pageMasterSlice.reducer;
