import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../api/ApiClient';

export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async () => {
        const response = await apiClient.get('/messages');
        return response.data;
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (messageData) => {
        const response = await apiClient.post('/messages', messageData);
        return response.data;
    }
);

const messagesSlice = createSlice ({
    name: 'messages',
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            const exists = state.messages.find(msg => msg.id === action.payload.id);
            if(!exists) {
                state.messages.push(action.payload);
            }            
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                //state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {addMessage} = messagesSlice.actions;
export default messagesSlice.reducer;