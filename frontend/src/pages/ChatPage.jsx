import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, setCurrentChannel } from '../store/slices/channelsSlice';
import { fetchMessages, sendMessage } from '../store/slices/messagesSlice';
import AuthContext from '../contexts/AuthContext';
import { useContext } from 'react';
import { useSocket } from '../hooks/useSocket';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  useSocket();

  const { channels, currentChannelId, loading: channelsLoading } = useSelector((state) => state.channels);
  const { messages, loading: messagesLoading } = useSelector((state) => state.messages);

  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  const currentMessages = messages.filter((msg) => msg.channelId === currentChannelId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    setSending(true);

    try {
      await dispatch(sendMessage({
        body: messageText,
        channelId: currentChannelId,
        username: user?.username || 'Usuario',
      })).unwrap();

      setMessageText('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar mensaje. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  if (channelsLoading || messagesLoading) {
    return <div>Cargando chat...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h3>Canales</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {channels.map((channel) => (
            <li
              key={channel.id}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
              style={{
                padding: '0.5rem',
                cursor: 'pointer',
                fontWeight: channel.id === currentChannelId ? 'bold' : 'normal',
                backgroundColor: channel.id === currentChannelId ? '#e0e0e0' : 'transparent'
              }}
            >
              # {channel.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Área de Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header con nombre del canal */}
        <div style={{padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5'}}>
          <h2 style={{margin: 0}}>
            # {channels.find(ch => ch.id === currentChannelId)?.name || 'Canal'}
          </h2>
        </div>

        {/* Mensajes */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {currentMessages.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem'}}>
              No hay mensajes en este canal.
            </p>
          ) : (
            currentMessages.map((message) => (
              <div key={message.id} style={{ marginBottom: '1rem' }}>
                <div>
                  <strong style={{ color: '#0066cc' }}>{message.username}</strong>
                  <span style={{ color: '#999', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                    {new Date(message.timestamp || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ marginTop: '0.25rem' }}>{message.body}</div>
              </div>
            ))
          )}
        </div>

        {/* Formulario de envío */}
        <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid #ccc', display: 'flex', gap: '0.5rem'}}>
          <input type='text' value={messageText} onChange={(e)=> setMessageText(e.target.value)}
            placeholder="Escribe un mensaje..." disabled={sending}
            style={{flex: 1, padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', outline: 'none'}}
          />
          <button type='submit' disabled={sending || !messageText.trim()}
            style={{padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: sending || !messageText.trim() ? '#ccc' : '#0066cc',
              color: 'white', border: 'none', borderRadius: '4px', cursor: sending || !messageText.trim() ? 'not-allowed' : 'pointer', fontWeight: '600'}}
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>          
        </form>        
      </div>
    </div>
  );
};

export default ChatPage;