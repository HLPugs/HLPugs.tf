import { player }           from './player';
import { playerTFClassMap } from './playerTFClassMap';

/**
 * @typedef TeamColor
 */
export type TeamColor = string | number;

/**
 * Describes a team.
 * @typedef Team
 * @property {player} captain - The team's captain.
 * @property {number} score - The team's score.
 * @property {TeamColor} color - The team's color. Either RED or BLU.
 * @property {playerTFClassMap} classes - A {@Link PlayerTFClassMap} that matches
 * players to their respective classes.
 */
export class Team {
  captain: player;
  score: number;
  color: TeamColor;
  classes: playerTFClassMap;

    /**
     * Creates a new Team object.
     * @param {player} captain - The team's captain.
     * @param {TeamColor} color - The team's color. Either RED or BLU.
     * @param {playerTFClassMap} classes - A playerTFClassMap that matches players to their
     *     respective classes.
     * @param {number} [score=0] - The team's score.
     */
  constructor(captain: player, color: TeamColor, classes: playerTFClassMap, score: number = 0) {
    this.captain = captain;
    this.score = score;
    this.color = color;
    this.classes = classes;
  }

    /**
     * Take either a string or a number and returns a team color that matches that number/string.
     * @param {TeamColor} input - The string/number to parse.
     * @returns {string|false} - Either a team color or false if none could be parsed.
     */
  parseColor(input: TeamColor): string | false {
    if (typeof input === 'number') {
      switch (input) {
        case 0: return 'RED';
        case 1: return 'BLU';
        default: return false;
      }
    }
    if (input.match(/red/i)) return 'RED';
    if (input.match(/blu/i)) return 'BLU';

    // Return false if above cases did not match
    return false;
  }
}
