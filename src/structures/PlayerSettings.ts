import { DraftTFClass }   from './DraftClassList';

/**
 * Describes a {@link Player}'s settings
 * @typedef PlayerSettings
 * @property {DraftTFClass[]} favoriteClasses - The player's list
 * of {@link DraftTFClass}'s to automatically add up to after certain triggers
 * @property {number} volume - The player's volume for sounds on the website
 * @property {string} voicepack - The player's voicepack for playing sounds on the website
 * @property {boolean} isNotifiableByMention - A flag to enable notifications
 * when a player's name is mentioned in chat prefixed with an @ (ex: @Gabe hi!)
 */
export class PlayerSettings {
  favoriteClasses?: DraftTFClass[] = [];
  volume?: number                  = 50;
  voicepack?: string               = 'default';
  isNotifiableByMention?: boolean  = true;
  [key: string]: object | number | string | boolean | DraftTFClass[];

  /**
   * Populate's the player's settings with new settings (and their default values) that the player's settings don't have
   * @param {PlayerSettings} settings
   * @return {PlayerSettings} A new {@link PlayerSettings} object with new
   * settings if there were any the player didn't have
   */
  static fromObject(settings: PlayerSettings): PlayerSettings {
    return { ...new PlayerSettings(), ...settings };
  }

  /**
   * Checks if the {@link PlayerSettings} object passed has all of
   * the properties that the base {@link PlayerSettings} has
   * @param {PlayerSettings} settings
   * @return {boolean} True if it matches the structure
   */
  static matchesStructure(settings: PlayerSettings): boolean {
    const settingsStructure = new PlayerSettings();
    for (const settingsKey in settingsStructure) {
      if (!(settingsKey in settings)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * This is intended to be used to be passed into the updateSetting method in the Player class
 */
export type PlayerSetting = 'volume' | 'voicepack' | 'isNotifiableByMention';
