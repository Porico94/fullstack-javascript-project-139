import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteChannel } from '../../store/slices/channelsSlice';
import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import { useRollbar } from '@rollbar/react';

const DeleteChannelModal = ({ show, onHide, channel }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.channels);

  const handleDelete = async () => {
    try {
      await dispatch(deleteChannel(channel.id)).unwrap();
      toast.success(t('notifications.channelDeleted'));
      onHide();
    } catch (err) {
      rollbar.error('Error al crear canal desde el modal', err, {
        triedName: channel.name,
        location: 'DeleteChannelModal'
      });
      toast.error(t('notifications.channelDeleteError'));      
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
        <Modal.Title>{t('deleteChannelModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('deleteChannelModal.confirmMessage')}</p>
        <p className="text-danger">{t('deleteChannelModal.warning')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? t('common.deleting') : t('common.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteChannelModal;