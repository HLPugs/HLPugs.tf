import { Socket, Server } from 'socket.io';
import { SocketController, SocketIO, OnMessage, MessageBody, ConnectedSocket, SocketRequest } from 'socket-controllers';
import ValidateClass from '../../utils/ValidateClass';
import CreateAnnouncementRequest from '../../../../Common/Requests/CreateAnnouncementRequest';
import AnnouncementService from '../../services/AnnouncementService';
import Announcement from '../../entities/Announcement';
import SocketRequestWithPlayer from '../../interfaces/SocketRequestWithPlayer';
import HomepageAnnouncementViewModel from '../../../../Common/ViewModels/HomepageAnnouncementViewModel';
import { EnvironmentConfig } from '../../constants/SiteConfiguration';

@SocketController()
export default class AnnouncementSocketController {
	private readonly announcementService = new AnnouncementService();

	@OnMessage('getHomepageAnnouncements')
	async getHomepageAnnouncements(@ConnectedSocket() socket: Socket) {
		const announcements = await this.announcementService.getAnnouncements(EnvironmentConfig.region);
		const announcementViewModels = announcements
			.sort((a, b) => (a.order > b.order ? 1 : -1)) // sort by order ascending
			.map(announcement => Announcement.toHomepageAnnouncementViewModel(announcement));
		socket.emit('getHomepageAnnouncements', announcementViewModels);
	}

	@OnMessage('createAnnouncement')
	async createAnnouncement(
		@SocketIO() io: Server,
		@MessageBody() payload: CreateAnnouncementRequest,
		@SocketRequest() request: SocketRequestWithPlayer
	) {
		ValidateClass(payload);
		const announcement = {
			creatorSteamid: request.session.player.steamid,
			messageContent: payload.messageContent,
			order: payload.order,
			priority: payload.priority,
			region: payload.region,
			timestamp: new Date()
		} as Announcement;
		ValidateClass(announcement);
		const createdAnnouncement = await this.announcementService.createAnnouncement(announcement);
		io.emit('createAnnouncement', Announcement.toHomepageAnnouncementViewModel(createdAnnouncement));
	}
}
