import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteChannel } from '../../store/slices/channelsSlice';

const DeleteChannelModal = ({ show, onHide, channel }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.channels);

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channel.id)).unwrap();
      onHide();
    } catch (err) {
      alert('Error al eliminar canal');
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
        <Modal.Title>Eliminar canal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Estás seguro de que deseas eliminar el canal <strong>#{channel?.name}</strong>?</p>
        <p className="text-danger">Esta acción no se puede deshacer.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;