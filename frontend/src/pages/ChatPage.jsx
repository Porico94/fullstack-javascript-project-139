import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "react-bootstrap";
import { fetchChannels } from '../store/slices/channelsSlice';
import { fetchMessages, sendMessage } from '../store/slices/messagesSlice';
import AuthContext from '../contexts/AuthContext';
import { useSocket } from '../hooks/useSocket';
import ChannelItem from "../components/ChannelItem";
import AddChannelModal from "../components/modals/AddChannelModal";
import DeleteChannelModal from "../components/modals/DeleteChannelModal";
import RenameChannelModal from "../components/modals/RenameChannelModal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ChatPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  useSocket();

  const { channels, currentChannelId, loading: channelsLoading } = useSelector((state) => state.channels);
  const { messages, loading: messagesLoading } = useSelector((state) => state.messages);

  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);  
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchChannels()).unwrap();        
      } catch(error) {
        toast.error(t('notifications.channelsLoadError'));
      }

      try {
        await dispatch(fetchMessages());
      } catch {
        toast.error(t('notifications.messagesLoadError'))
      }
    };

    loadData();
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
      toast.error(t('notifications.messageSendError'))
    } finally {
      setSending(false);
    }
  };
  
  const handleRenameChannel = (channel) => {
    setSelectedChannel(channel);
    setShowRenameModal(true);
  };

  const handleDeleteChannel = (channel) => {
    setSelectedChannel(channel);
    setShowDeleteModal(true);
  };

  if (channelsLoading || messagesLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>{t('chat.loading')}</div>
      </div>
    );
  }

  const currentChannel = channels.find(ch => ch.id === currentChannelId) || channels[0];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      <div style={{
        width: '250px',
        borderRight: '1px solid #ccc',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'  
      }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem' 
      }}>
        <h3>Canales</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {            
            setShowAddModal(true);
          }}
        >
          +
        </Button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, flex: 1, overflowY: 'auto' }}>
        {channels.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isActive={channel.id === currentChannelId}
            onRename={handleRenameChannel}
            onDelete={handleDeleteChannel}
          />
        ))}
      </ul>
    </div>

      {/* Área de Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header con nombre del canal */}
        <div style={{padding: '1rem', borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5'}}>
          <h2 style={{margin: 0}}>
            # {channelsLoading ? t('chat.chats') : (currentChannel?.name || 'Canal')}
          </h2>
        </div>

        {/* Mensajes */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {currentMessages.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem'}}>
              {t('chat.noMessages')}.
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
            placeholder={t('chat.messagePlaceholder')} disabled={sending}
            style={{flex: 1, padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', outline: 'none'}}
          />
          <button type='submit' disabled={sending || !messageText.trim()}
            style={{padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: sending || !messageText.trim() ? '#ccc' : '#0066cc',
              color: 'white', border: 'none', borderRadius: '4px', cursor: sending || !messageText.trim() ? 'not-allowed' : 'pointer', fontWeight: '600'}}
          >
            {sending ? t('common.sending') : t('common.send')}
          </button>
        </form>
      </div>

      <AddChannelModal show={showAddModal} onHide={() => setShowAddModal(false)}/>
      <RenameChannelModal show={showRenameModal} onHide={() => setShowRenameModal(false)} channel={selectedChannel}/>
      <DeleteChannelModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} channel={selectedChannel}/>
    </div>
  );
};

export default ChatPage;