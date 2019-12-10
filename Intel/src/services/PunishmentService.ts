import Punishment from '../../../Common/Models/Punishment';

import PunishmentEntity from '../entities/PunishmentEntity';

import { LinqRepository } from 'typeorm-linq-repository';

export default class PunishmentService {
	async addPunishment(punishment: Punishment): Promise<PunishmentEntity> {
		const punishmentEntity = await PunishmentEntity.fromPunishment(punishment);
		const punishmentRepository = new LinqRepository(PunishmentEntity);
		return await punishmentRepository.create(punishmentEntity);
	}
}
