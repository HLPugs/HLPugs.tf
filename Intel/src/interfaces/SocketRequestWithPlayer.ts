import { IncomingMessage } from 'http';
import RequestWithPlayer from './RequestWithPlayer';

export default interface SocketRequestWithPlayer extends IncomingMessage {
	session: RequestWithPlayer & { id: string; save: () => {} };
}
