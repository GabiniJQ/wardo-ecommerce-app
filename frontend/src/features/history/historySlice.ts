import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastSearch: '',
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setLastSearch: (state, action) => {
      if (action.payload) {
        state.lastSearch = action.payload
      }
    }
  }
})

export const { setLastSearch } = historySlice.actions
export default historySlice.reducer