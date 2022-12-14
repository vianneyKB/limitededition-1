import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rotation: 0
};

export const materialPanelSlice = createSlice({
  name: 'materialPanel',
  initialState,
  reducers: {
    setRotation: (state, action) => {
      state.rotation = action.payload;
    }
  }
});

export const {
    setRotation
} = materialPanelSlice.actions;
export const selectRotation = (state) => state.materialPanel.rotation;


export default materialPanelSlice.reducer;
