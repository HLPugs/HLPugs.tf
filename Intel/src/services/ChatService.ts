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

	playerSentMessageTooFast(steamid: SteamID): boolean {
		const latestMessage = this.getLatestMessage(steamid);
		const currentTimestamp = new Date();
		console.log(latestMessage);
		if (!latestMessage) {
			return false;
		} else {
			console.log(currentTimestamp.valueOf() - latestMessage.timestamp);
			return currentTimestamp.valueOf() - latestMessage.timestamp < CHAT_MESSAGE_THRESHOLD;
		}
	}

	private getLatestMessage(steamid: SteamID) {
		const playerMessagesOrderedByTimestampDescending = this.messageHistory
			.filter(x => x.authorSteamid === steamid)
			.sort((a, b) => b.timestamp - a.timestamp);
		return playerMessagesOrderedByTimestampDescending[0];
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
