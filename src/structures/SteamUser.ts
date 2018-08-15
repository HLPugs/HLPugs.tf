export interface SteamUser {
  steamUser: {
    steamid: string;
    username: string;
    name: string;
    profile: string;
    avatar: {
	  small: string;
	  medium: string;
	  large: string;
    }
  };
}
