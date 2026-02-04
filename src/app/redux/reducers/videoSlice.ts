import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { VideoProps } from '../../types';

export interface VideoStateProps {
  muted: boolean;
  paused: boolean;
  showPopup: boolean;
  video?: VideoProps;
}

const initialState: VideoStateProps = {
  muted: true,
  paused: null,
  showPopup: true
};
export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setVideoProps: (state, action: PayloadAction<VideoStateProps>) => {
      return action.payload;
    },
    setVideoMuted: (state, action: PayloadAction<boolean>) => {
      state.muted = action.payload;
    },
    setVideoPaused: (state, action: PayloadAction<boolean>) => {
      state.paused = action.payload;
    },
    setVideoPopupShown: (state, action: PayloadAction<boolean>) => {
      state.showPopup = action.payload;
    },
    setVideoDocument: (state, action: PayloadAction<VideoProps>) => {
      state.video = action.payload;
    },
  },
});

export const { setVideoProps, setVideoMuted, setVideoPaused, setVideoPopupShown } = modalSlice.actions;

export default modalSlice.reducer;
