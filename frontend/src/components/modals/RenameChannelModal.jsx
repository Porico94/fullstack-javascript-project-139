import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { renameChannel } from '../../store/slices/channelsSlice';

const RenameChannelModal = ({ show, onHide, channel }) => {
  const inputRef = useRef(null);
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, loading } = useSelector((state) => state.channels);

  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setError('');
      if (channel) {
        setChannelName(channel.name);
      }

      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  }, [show, channel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!channelName.trim()) {
      setError(t('renameChannelModal.errors.nameEmpty'));
      return;
    }

    const exists = channels.find(
      (ch) => ch.id !== channel.id && ch.name.toLowerCase() === channelName.trim().toLowerCase(),
    );

    if (exists) {
      setError(t('renameChannelModal.errors.nameExists'));
      return;
    }

    try {
      await dispatch(renameChannel({ id: channel.id, name: channelName.trim() })).unwrap();
      toast.success(t('notifications.channelRenamed'));
      setError('');
      onHide();
    } catch (err) {
      rollbar.error('Error al renombrar canal desde el modal', err, {
        triedName: channel.name,
        location: 'RenameChannelModal',
      });
      toast.error(t('notifications.channelRenameError'));
      setError(t('renameChannelModal.errors.renameError'));
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
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannelModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="rename-channel-input">{t('renameChannelModal.channelNameLabel')}</Form.Label>
            <Form.Control
              id="rename-channel-input"
              type="text"
              value={channelName}
              ref={inputRef}
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
          {t('common.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading || !channelName.trim()}
        >
          {loading ? t('common.renaming') : t('common.rename')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RenameChannelModal;
