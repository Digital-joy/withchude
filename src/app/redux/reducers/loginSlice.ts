import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LoginStateProps {
  show: boolean;
}

const initialState: LoginStateProps = {
  show: false,
};
export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setLoginProps: (state, action: PayloadAction<LoginStateProps>) => {
      return action.payload;
    },
    setLoginShown: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
  },
});

export const { setLoginProps, setLoginShown } = modalSlice.actions;

export default modalSlice.reducer;
