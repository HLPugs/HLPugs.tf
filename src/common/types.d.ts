 export interface steamUser {
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
export interface steamUserAPI {
  steamUserAPI: {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    lastlogoff: number;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    personastate: number;
    realname: string;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
    loccountrycode: string;
    locstatecode: string;
  };
}
