import { Socket } from 'socket.io';
import { SocketIO, SocketController, OnMessage, MessageBody, ConnectedSocket } from 'socket-controllers';
import AnnouncementService from '../../services/AnnouncementService';
import Region from '../../../../Common/Enums/Region';
import AdminAnnouncementViewModel from '../../../../Common/ViewModels/AdminAnnouncementViewModel';

@SocketController()
export default class AdminSocketController {
	private readonly announcementService = new AnnouncementService();
	@OnMessage('getAdminAnnouncements')
	async getAdminAnnouncements(@ConnectedSocket() socket: Socket) {
		const announcements = await this.announcementService.getAnnouncements(Region.All);
		const viewmodels = announcements.map(x => AdminAnnouncementViewModel.fromAnnouncement(x));
		socket.emit('getAdminAnnouncements', viewmodels);
	}
}
