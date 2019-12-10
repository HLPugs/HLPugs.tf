import { Request } from 'express';
import Player from '../../../Common/Models/Player';

type RequestWithPlayer = { player: Player; session: { player: Player } } & Request;

export default RequestWithPlayer