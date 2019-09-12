import { Request } from 'express';
import Player from '../entities/Player';

type RequestWithPlayer = { player: Player; session: { player: Player } } & Request;

export default RequestWithPlayer