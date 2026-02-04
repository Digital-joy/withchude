import { configureStore } from '@reduxjs/toolkit';
import videoSlice from './reducers/videoSlice';
import surveySlice from './reducers/surveySlice';
import toastSlice from './reducers/toastSlice';
import shareSlice from './reducers/shareSlice';
import loginSlice from './reducers/loginSlice';
import newsletterSlice from './reducers/newsletterSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      survey: surveySlice,
      newsletter: newsletterSlice,
      toast: toastSlice,
      video: videoSlice,
      share: shareSlice,
      login: loginSlice
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
