import { Socket } from 'socket.io';
import SocketRequestWithPlayer from './SocketRequestWithPlayer';

interface SocketWithPlayer extends Socket {
	request: SocketRequestWithPlayer;
}

export default SocketWithPlayer;
