import {createSlice, configureStore} from '@reduxjs/toolkit';

const CONSTANTS = createSlice({
  name: 'CONSTANTS',
  initialState: {
    ip: 'http://13.202.224.218:5001',
  },
});

const USERDATA = createSlice({
  name: 'USERDATA',
  initialState: {},
  reducers: {
    loadUserData(state, action) {
      return {...action.payload};
    },
  },
});

const store = configureStore({
  reducer: {
    USERDATA: USERDATA.reducer,
    CONSTANTS: CONSTANTS.reducer,
  },
});

export const UserDataActions = USERDATA.actions;
export const ConstantsActions = CONSTANTS.actions;

export default store;
