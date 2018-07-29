export interface Punishment {
  punishment: string;
  data: {
    expiration: string,
    issued_on: string,
    creator: string,
    steamid: string,
    reason: string,
  };
}
