import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface NewsletterStateProps {
  show: boolean;
}

const initialState: NewsletterStateProps = {
  show: false,
};
export const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    setNewsletterProps: (state, action: PayloadAction<NewsletterStateProps>) => {
      state = action.payload;
    },
    setNewsletterShown: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    }
  },
});

export const { setNewsletterProps, setNewsletterShown } = newsletterSlice.actions;

export default newsletterSlice.reducer;
