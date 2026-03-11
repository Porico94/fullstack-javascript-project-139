import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../../store/slices/channelsSlice';

const RenameChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const { channels, loading } = useSelector((state) => state.channels);
  
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (channel) {
      setChannelName(channel.name);
    }
  }, [channel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!channelName.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    
    const exists = channels.find(
      ch => ch.id !== channel.id && ch.name.toLowerCase() === channelName.trim().toLowerCase()
    );
    
    if (exists) {
      setError('Ya existe un canal con ese nombre');
      return;
    }
    
    try {
      await dispatch(renameChannel({ id: channel.id, name: channelName.trim() })).unwrap();
      setError('');
      onHide();
    } catch (err) {
      setError('Error al renombrar canal');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      channel={channel}
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Renombrar canal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nombre del canal</Form.Label>
            <Form.Control
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              disabled={loading}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !channelName.trim()}>
          {loading ? 'Renombrando...' : 'Renombrar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RenameChannelModal;