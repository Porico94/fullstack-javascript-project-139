import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel } from '../../store/slices/channelsSlice';

const AddChannelModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const { channels, loading } = useSelector((state) => state.channels);
  
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campo vacío
    if (!channelName.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    
    // Validar duplicados
    const exists = channels.find(
      ch => ch.name.toLowerCase() === channelName.trim().toLowerCase()
    );
    
    if (exists) {
      setError('Ya existe un canal con ese nombre');
      return;
    }
    
    try {
      await dispatch(createChannel({ name: channelName.trim() })).unwrap();
      setChannelName('');
      setError('');
      onHide();
    } catch (err) {
      setError('Error al crear canal');
    }
  };  

  const handleShow = () => {
    setChannelName('');
    setError('');
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
      onShow={handleShow}
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar canal</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group>
          <Form.Label>Nombre del canal</Form.Label>
          <Form.Control
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="nombre-del-canal"
            autoFocus
            disabled={loading}
            isInvalid={!!error}
          />
          <Form.Control.Feedback type="invalid">
            {error}
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !channelName.trim()}>
          {loading ? 'Creando...' : 'Crear'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddChannelModal;