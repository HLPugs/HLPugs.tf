import { Socket } from 'socket.io';
import RequestWithPlayer from './RequestWithPlayer';

interface SocketRequestWithPlayer extends Socket {
		session: RequestWithPlayer;
}

export default SocketRequestWithPlayer;
