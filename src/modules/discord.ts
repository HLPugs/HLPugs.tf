import * as config from 'config';
import * as request from 'request';
/**
 * Posts a string to the HLPugs.tf Discord server as a webhook message.
 * @module Discord
 * @param {string} message - The message to send.
 * @param {string} channel - The channel to send the message in.
 * @param {boolean} [fancy=false] - If fancy = true, put the message contents in a Discord embed
 */
// tslint:disable-next-line:max-line-length
export async function postToDiscord(message: string, channel: string, fancy = false): Promise<void> {
  if (config.get(`discord.webhooks.${channel}`) !== undefined) {
    const data = {
      url: config.get(`discord.webhooks.${channel}`),
      method: 'POST',
      body: {
        avatar_url: '',
        content: message,
        username: config.get('discord.username'),
	    embeds: fancy ? [{ description: message }] : [],
      },
      json: true,
    };
    await request(data, (err) => {
      if (err) {
        console.warn(`[Webhook] ${err}`);
      }
    });
  } else {
  	// Log something error related
  }
}
