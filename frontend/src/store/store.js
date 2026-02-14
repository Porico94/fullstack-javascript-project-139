import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice';
import messagesReducer from './slices/messagesSlice';

const store = configureStore({
  reducer: {
    channels: channelsReducer,   // state.channels
    messages: messagesReducer,   // state.messages
  },
});

export default store;