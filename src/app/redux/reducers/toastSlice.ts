import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ToastStateProps {
  show: boolean;
  message: string;
  timeout?: number; // number of miliseconds to toast disappearance
  persist?: boolean // signifies if toast show disappear after 'timeout'
}

const initialState: ToastStateProps = {
  show: false,
  message: '',
  timeout: 2500,
  persist: true,
};
export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToastProps: (state, action: PayloadAction<ToastStateProps>) => {
      return { ...state, ...action.payload }; // Merge existing state with new properties
      // const {payload} = action;
      // state.show = payload.show
      // state.persist = payload.persist
      // state.message = payload.message
      // state.timeout = payload.timeout
    },
    setToastShown: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    setToastMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setToastProps, setToastShown } = toastSlice.actions;

export default toastSlice.reducer;
