import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../api/ApiClient';

export const fetchChannels = createAsyncThunk(
    'channels/fetchChannels',
    async () => {
        const response = await apiClient.get('/channels');
        return response.data;
    }
);

const channelsSlice = createSlice ({
    name: 'channels',
    initialState: {
        channels: [],
        currentChannelId: 1,
        loading: false,
        error: null,
    },
    reducers: {
        setCurrentChannel: (state, action) => {
            state.currentChannelId = action.payload;
        },

        addChannel: (state, action) => {
            state.channels.push(action.payload);
        },

        removeChannel: (state, action) => {
            state.channels = state.channels.filter(
                (channel) => channel.id !== action.payload
            )
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChannels.fulfilled, (state, action) => {
                state.loading = false;
                state.channels = action.payload;
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {setCurrentChannel, addChannel, removeChannel} = channelsSlice.actions;
export default channelsSlice.reducer;