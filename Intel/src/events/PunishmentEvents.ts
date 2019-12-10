import { OnMessage, SocketRequest } from 'socket-controllers';

import SocketRequestWithPlayer from '../interfaces/SocketRequestWithPlayer';

import PlayerHasPermission from '../utils/PlayerHasPermission';

import Permission from '../../../Common/Enums/Permission';
import SteamID from '../../../Common/Types/SteamID';
import PunishmentType from '../../../Common/Enums/PunishmentType';
import ValidateClass from '../utils/ValidateClass';
import Punishment from '../../../Common/Models/Punishment';
import { io } from '../server';
import Logger from '../modules/Logger';
import PlayerService from '../services/PlayerService';
import PunishmentService from '../services/PunishmentService';

export default class PunishmentEvents {
	private readonly playerService = new PlayerService();
	private readonly punishmentService = new PunishmentService();

	async mutePlayer(authorSteamID: SteamID, playerToMuteSteamid: SteamID, expirationDate: Date, reason: string) {
		const punishments = await this.playerService.getActivePunishments(playerToMuteSteamid);
		if (punishments.some(p => p.punishmentType === PunishmentType.CHAT_MUTE)) {
			// Player is already muted
		} else {
			const punishment = ValidateClass<Punishment>({
				creationDate: new Date(),
				authorSteamID,
				expirationDate,
				lastModifiedDate: new Date(),
				punishmentType: PunishmentType.CHAT_MUTE,
				reason,
				offenderSteamID: playerToMuteSteamid
			});

			await this.punishmentService.addPunishment(punishment);
			io.to(playerToMuteSteamid).emit('mutedInChat', punishment);
			Logger.logInfo('Player muted in chat', punishment);
		}
	}
}
