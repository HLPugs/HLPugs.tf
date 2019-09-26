import * as config from 'config';
import * as request from 'request';

/**
 * Posts a string to the HLPugs.tf Discord server as a webhook message.
 * @module Discord
 * @param {string} message - The message to send.
 * @param {string} channel - The channel to send the message in.
 * @param {boolean} [fancy=false] - If fancy = true, put the message contents in a Discord embed
 * @returns {string} Successful if no errors thrown
 */
export default class DiscordService {
	static async postToDiscord(message: string, channel: string, fancy = false): Promise<void> {
		const { username } = config.get('discord');
		const url = config.get(`discord.webhooks.${channel}`);

		const data = {
			url,
			username,
			method: 'POST',
			body: {
				avatar_url: '',
				content: fancy ? '' : message,
				embeds: fancy ? [{ description: message }] : []
			},
			json: true
		};

		await request(data);
	}
}
