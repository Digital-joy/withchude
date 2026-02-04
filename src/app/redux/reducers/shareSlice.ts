import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ShareStateProps {
  show: boolean;
}

const initialState: ShareStateProps = {
  show: false,
};
export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setShareProps: (state, action: PayloadAction<ShareStateProps>) => {
      return action.payload;
    },
    setShareShown: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
  },
});

export const { setShareProps, setShareShown } = modalSlice.actions;

export default modalSlice.reducer;
