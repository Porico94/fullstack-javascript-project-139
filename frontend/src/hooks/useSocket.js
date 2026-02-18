import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { addMessage } from '../store/slices/messagesSlice';
import { addChannel, removeChannel } from '../store/slices/channelsSlice';

let socket = null;

export const useSocket = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        socket = io('http://localhost:5001', {
            transports: ['websocket'],
            upgrade: false,
        });

        socket.on('connect', () => {
            console.log('Conectado a webSocket, ID:', socket.id);
        });

        socket.on('newMessage', (message) => {
            console.log('Nuevo mensaje:', message)
            dispatch(addMessage(message));
        });

        socket.on('newChannel', (channel) => {
            console.log('Nuevo canal:', channel);
            dispatch(addChannel(channel));
        });

        socket.on('removeChannel', ({id}) => {
            console.log('Canal eliminado:', id);
            dispatch(removeChannel(id));
        });

        socket.on('disconnect', () => {
            console.log('Desconectado');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión WebSocket:', error);
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);

    return socket;
};