import AnnouncementService from './AnnouncementService';
import ChatService from './ChatService';
import ChatWordService from './ChatWordService';
import DebugService from './DebugService';
import DiscordService from './DiscordService';
import DraftService from './DraftService';
import PlayerService from './PlayerService';
import ProfileService from './ProfileService';
import SessionService from './SessionService';

const announcementService = new AnnouncementService();
const chatService = new ChatService();
const chatWordService = new ChatWordService();
const debugService = new DebugService();
const discordService = new DiscordService();
const draftService = new DraftService();
const playerService = new PlayerService();
const profileService = new ProfileService();
const sessionService = new SessionService();

export {
	announcementService,
	chatService,
	chatWordService,
	debugService,
	discordService,
	draftService,
	playerService,
	profileService,
	sessionService
};
