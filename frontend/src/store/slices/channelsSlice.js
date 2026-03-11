import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../../api/ApiClient';

export const fetchChannels = createAsyncThunk(
    'channels/fetchChannels',
    async () => {
        const response = await apiClient.get('/channels');
        return response.data;
    }
);

export const createChannel = createAsyncThunk(
    'channels/createChannel',
    async (channelData) => {
        const response = await apiClient.post('/channels', channelData);
        return response.data;
    }
);

export const deleteChannel = createAsyncThunk(
    'channels/deleteChannel',
    async (channelId) => {
        await apiClient.delete(`/channels/${channelId}`);
        return channelId;
    }
);

export const renameChannel = createAsyncThunk(
    'channels/renameChannel',
    async ({id, name}) => {
        const response = await apiClient.patch(`/channels/${id}`, {name});
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
            const exists = state.channels.find(ch => ch.id === action.payload.id);
            if (!exists) {
                state.channels.push(action.payload);
            }
        },

        removeChannel: (state, action) => {
            state.channels = state.channels.filter(
                (channel) => channel.id !== action.payload
            );
        },

        updateChannel: (state, action) => {
            const index = state.channels.findIndex(ch => ch.id === action.payload.id);
            if (index !== -1) {
                state.channels[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            //fetch channels
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
            })
            //Create channel
            .addCase(createChannel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createChannel.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChannelId = action.payload.id;
            })
            .addCase(createChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            //Delete channel
            .addCase(deleteChannel.pending, (state) => {
                state.loading = true;                
            })
            .addCase(deleteChannel.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentChannelId === action.payload) {
                    state.currentChannelId = 1;
                }
            })
            .addCase(deleteChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            //Rename channel
            .addCase(renameChannel.pending, (state) => {
                state.loading = true;
            })
            .addCase(renameChannel.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(renameChannel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {setCurrentChannel, addChannel, removeChannel, updateChannel} = channelsSlice.actions;
export default channelsSlice.reducer;