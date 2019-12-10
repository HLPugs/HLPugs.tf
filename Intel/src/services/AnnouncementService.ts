import Region from '../../../Common/Enums/Region';
import { LinqRepository } from 'typeorm-linq-repository';
import AnnouncementEntity from '../entities/AnnouncementEntity';

export default class AnnouncementService {
	private readonly announcementRepository = new LinqRepository(AnnouncementEntity);

	async getAnnouncements(region: Region): Promise<AnnouncementEntity[]> {
		if (region === Region.All) {
			return await this.announcementRepository.getAll();
		} else {
			return await this.announcementRepository
				.getAll()
				.where(x => x.region)
				.equal(region);
		}
	}

	async createAnnouncement(announcement: AnnouncementEntity): Promise<AnnouncementEntity> {
		return await this.announcementRepository.create(announcement);
	}
}
