import * as config from 'config';
import * as steam from 'steam-login';

const SteamMiddleware = steam.middleware({
    realm: config.get('app.steam.realm'),
    verify: config.get('app.steam.verify'),
    apiKey: config.get('app.steam.apiKey'),
});

export default SteamMiddleware;