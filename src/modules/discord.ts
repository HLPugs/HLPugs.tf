import { config } from 'node-config-ts';
import * as request from 'request';

export function postToDiscord(message: string, channel: string): any {
  const webhookConfigPath = `discord.webhooks.${channel}`;
  console.log(config[webhookConfigPath]);
  if (config[webhookConfigPath]) {
    const data = {
      url: config[webhookConfigPath],
      method: 'POST',
      body: {
        avatar_url: '',
        content: message,
        username: 'HLPugs.tf',
      },
      json: true,
    };
    request(data, (err) => {
      if (err) {
        console.warn(`[Webhook] ${err}`);
      }
    });
  }
}
