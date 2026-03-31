import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/slices/channelsSlice';
import { useTranslation } from "react-i18next";

const ChannelItem = ({ channel, isActive, onRename, onDelete }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleChannelClick = () => {
    dispatch(setCurrentChannel(channel.id));
  };

  return (
    <li style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem',
      cursor: 'pointer',
      fontWeight: isActive ? 'bold' : 'normal',
      backgroundColor: isActive ? '#e0e0e0' : 'transparent',
      borderRadius: '4px',
      marginBottom: '0.25rem'
    }}>
      <div 
        onClick={handleChannelClick}
        style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        # {channel.name}
      </div>

      {channel.removable && (
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="link"
            size="sm"
            aria-label='Manage channel'
            style={{
              padding: '0.25rem 0.5rem',
              color: '#666',
              textDecoration: 'none'
            }}
          >
            Manage channel
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onRename(channel)}>
              {t('common.rename')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(channel)} className="text-danger">
              {t('common.delete')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </li>
  );
};

export default ChannelItem;