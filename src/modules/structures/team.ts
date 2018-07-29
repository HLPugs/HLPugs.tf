import { Player }    from './player';
import { PlayerMap } from './playerMap';

/**
 * @typedef TeamColor
 */
export type TeamColor = string | number;

/**
 * Describes a team.
 * @typedef Team
 * @property {Player} captain - The team's captain.
 * @property {number} score - The team's score.
 * @property {TeamColor} color - The team's color. Either RED or BLU.
 * @property {PlayerMap} classes - A PlayerMap that matches players to their respective classes.
 */
export class Team {
  captain: Player;
  score: number;
  color: TeamColor;
  classes: PlayerMap;

    /**
     * Creates a new Team object.
     * @param {Player} captain - The team's captain.
     * @param {TeamColor} color - The team's color. Either RED or BLU.
     * @param {PlayerMap} classes - A PlayerMap that matches players to their respective classes.
     * @param {number} [score=0] - The team's score.
     */
  constructor(captain: Player, color: TeamColor, classes: PlayerMap, score = 0) {
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
    } else if (input.match(/red/i)) return 'RED';
    else if (input.match(/blu/i)) return 'BLU';
    else return false;
  }
}
