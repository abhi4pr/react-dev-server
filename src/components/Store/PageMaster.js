import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showAddModal: false,
  modalType:"",
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
    setModalType(state,action){
        state.modalType= action.payload
    }
  },
});
export const { setOpenShowAddModal, setCloseShowAddModal, setModalType } =
  pageMasterSlice.actions;
export default pageMasterSlice.reducer;
