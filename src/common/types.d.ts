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

export interface punishment{
  punishment: string;
  data: {
    expiration: string,
    issued_on: string,
    creator: string,
    steamid: string,
    reason: string,
  };
}

export interface player {
  steamid: string;
  avatar: string;
  captain: boolean;
  roles: object;
  punishments: boolean;
  alias: string;
}
