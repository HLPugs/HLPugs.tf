import * as config from 'config';
const apiKey = config.get('app.steam.apiKey');
import * as request from 'request';

// tslint:disable:prefer-array-literal
// tslint:disable:max-line-length
//
/**
 * Retrieves the corresponding Steam avatar URL for the passed SteamIDs
 *
 * @param {string | Array<string>} steamids - The SteamID or SteamIDs to request avatars for
 * @returns {Promise<string | Array<object>>} Returns an object containing the avatar and SteamID.
 * If multiple SteamID's are passed, the return is an array of objects with the respective Steam avatar and SteamID
 */
export async function getAvatars(steamids: string | Array<string>): Promise<string | Array<object>> {

  // Convert steamids to array if it is a single string because SteamIDs gets iterated through below
  const formattedSteamids: any = typeof steamids === 'string' ? [steamids] : steamids.join(',');
  const steamidsWithAvatars: Array<any> = [];

  // Get an array of avatars based on the steamid's that are passed
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${formattedSteamids}`;
  await request.get(url, (error, steamHttpResponse, steamHttpBody) => {
    if (steamHttpBody !== undefined && steamHttpBody !== 'undefined') {
      const steamInfo = JSON.parse(steamHttpBody);
      const avatars = steamInfo.response.players.map((player: any) => player.avatarmedium);
      for (const steamid in formattedSteamids) {
        const obj = { steamid: formattedSteamids[steamid], avatar: avatars[steamid] };
        steamidsWithAvatars.push(obj);
      }
    }
  });

  // Return the first object if there is only one SteamID passed
  return formattedSteamids.length === 1 ? steamidsWithAvatars[0] : steamidsWithAvatars;
}
