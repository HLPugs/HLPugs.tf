import { DraftTFClass } from './DraftClassList';

export class PlayerSettings {
  favoriteClasses: DraftTFClass[] = [];
  volume: number                  = 50;
  voicepack: string               = 'default';
  isNotifiableByMention: boolean  = true;
  [key: string]: number | string | boolean | DraftTFClass[];
}

/**
 * This is intended to be used to be passed into the updateSetting method in the Player class
 */
export type PlayerSetting = 'volume' | 'voicepack' | 'mentionNotification';
