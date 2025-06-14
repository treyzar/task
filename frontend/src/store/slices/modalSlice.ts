import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../types";

interface ModalState {
  isOpen: boolean;
  selectedTask?: Task;
}

const initialState: ModalState = {
  isOpen: false,
  selectedTask: undefined,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Task | undefined>) => {
      state.isOpen = true;
      state.selectedTask = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.selectedTask = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
