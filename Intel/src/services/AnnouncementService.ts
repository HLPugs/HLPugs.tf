import Region from '../../../Common/Enums/Region';
import { LinqRepository } from 'typeorm-linq-repository';
import Announcement from '../entities/Announcement';
import Player from '../entities/Player';

export default class AnnouncementService {
	private readonly announcementRepository = new LinqRepository(Announcement);

	async getAnnouncements(region: Region): Promise<Announcement[]> {
		if (region === Region.All) {
			return await this.announcementRepository.getAll();
		} else {
			return await this.announcementRepository
				.getAll()
				.where(x => x.region)
				.equal(region);
		}
	}

	async createAnnouncement(announcement: Announcement): Promise<Announcement> {
		return await this.announcementRepository.create(announcement);
	}
}
