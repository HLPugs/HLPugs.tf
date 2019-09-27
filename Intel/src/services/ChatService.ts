import SteamID from '../../../Common/Types/SteamID';
import ValidateClass from '../utils/ValidateClass';
import Message from '../../../Common/Models/Message';
import StorePlayerMessageRequest from '../../../Common/Requests/SendMessageRequest';
import ChatWordService from './ChatWordService';
import CHAT_MESSAGE_THRESHOLD from '../../../Common/Constants/ChatMessageThreshold';

export default class ChatService {
	private readonly chatWordService = new ChatWordService();
	private readonly messageHistory: Message[] = [];
	private readonly MESSAGE_HISTORY_MAX = 150;
	private blacklistedWords: string[];
	private whitelistedWords: string[];

	constructor() {
		this.chatWordService.getBlacklistedWords().then(words => (this.blacklistedWords = words));
		this.chatWordService.getWhitelistedWords().then(words => (this.whitelistedWords = words));
	}

	storePlayerMessage(message: Message) {
		if (this.playerSentMessageTooFast(message.authorSteamid)) return;

		message.messageContent = message.messageContent
			.split(' ')
			.map(word => this.censorWordIfBlacklisted(word))
			.join(' ');

		this.messageHistory.push(message);
		if (this.messageHistory.length > this.MESSAGE_HISTORY_MAX) {
			this.messageHistory.shift();
		}
	}

	getMessageHistory(): Message[] {
		return this.messageHistory;
	}

	private playerSentMessageTooFast(steamid: SteamID): boolean {
		const currentTimestamp = new Date();
		return this.messageHistory.some(message => {
			message.authorSteamid === steamid && message.timestamp - currentTimestamp.valueOf() < CHAT_MESSAGE_THRESHOLD;
		});
	}

	private censorWordIfBlacklisted(word: string) {
		let tempWord = word;

		this.whitelistedWords.forEach(
			whitelistedWord => (tempWord = tempWord.replace(new RegExp(whitelistedWord, 'ig'), ''))
		);

		const wordNotClean = this.blacklistedWords.some(blacklistedWord =>
			tempWord.toLowerCase().includes(blacklistedWord)
		);

		return wordNotClean ? '*'.repeat(word.length) : word;
	}
}
