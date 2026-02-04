import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SurveyProps } from '../../types';

export interface SurveyStateProps {
  activeSurvey?: SurveyProps | null;
  show: boolean;
}

const initialState: SurveyStateProps = {
  show: false,
};
export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurveyProps: (state, action: PayloadAction<SurveyStateProps>) => {
      state = action.payload;
    },
    setSurveyShown: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
    setActiveSurvey: (state, action: PayloadAction<SurveyProps | null>) => {
      state.activeSurvey = action.payload;
    },
  },
});

export const { setSurveyProps, setSurveyShown, setActiveSurvey } = surveySlice.actions;

export default surveySlice.reducer;
