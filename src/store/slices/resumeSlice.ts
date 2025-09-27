import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ResumeData {
  name: string | null;
  email: string | null;
  phone: string | null;
  fullText: string;
  missingFields: string[];
}

interface ResumeState {
  data: ResumeData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  data: null,
  isLoading: false,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setResumeData: (state, action: PayloadAction<ResumeData>) => {
      state.data = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearResume: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setResumeData, setLoading, setError, clearResume } = resumeSlice.actions;
export default resumeSlice.reducer;