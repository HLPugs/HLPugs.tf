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
		const viewmodels = announcements
			.sort((a, b) => (a.order > b.order ? 1 : -1)) // sort by order ascending
			.map(x => HomepageAnnouncementViewModel.fromAnnouncement(x));
		socket.emit('getHomepageAnnouncements', viewmodels);
	}

	@OnMessage('createAnnouncement')
	async createAnnouncement(
		@SocketIO() io: Server,
		@MessageBody() body: CreateAnnouncementRequest,
		@SocketRequest() request: SocketRequestWithPlayer
	) {
		ValidateClass(body);
		const announcement: Announcement = {
			creatorSteamid: request.session.player.steamid,
			messageContent: body.messageContent,
			order: body.order,
			priority: body.priority,
			region: body.region,
			timestamp: new Date()
		};
		ValidateClass(announcement);
		const createdAnnouncement = await this.announcementService.createAnnouncement(announcement);
		const viewmodel = HomepageAnnouncementViewModel.fromAnnouncement(createdAnnouncement);
		io.emit('createAnnouncement', viewmodel);
	}
}
