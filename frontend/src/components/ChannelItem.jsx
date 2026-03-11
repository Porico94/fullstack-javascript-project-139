import { Dropdown } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/slices/channelsSlice';

const ChannelItem = ({ channel, isActive, onRename, onDelete }) => {
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
            style={{
              padding: '0.25rem 0.5rem',
              color: '#666',
              textDecoration: 'none'
            }}
          >
            <span>⋮</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onRename(channel)}>
              Renombrar
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onDelete(channel)} className="text-danger">
              Eliminar
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </li>
  );
};

export default ChannelItem;