/**
 *
 */
export interface Punishment {
  type: PunishmentType;
  data: PunishmentData;
}

export type PunishmentType = 'ban' | 'mute' | 'crestrict' | 'mute';

export interface PunishmentData {
  expiration: string;
  issued_on: string;
  creator: string;
  steamid: string;
  reason: string;
}
