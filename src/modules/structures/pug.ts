import { Team } from './team';

/**
 * Describes a pug match.
 * @typedef Pug
 * @property {number} id - The pug's unique id.
 * @property {string} map - The map played in the pug.
 * @property {number} winningTeam - The index of the team that won in the teams array.
 * @property {Date} timestamp - The timestamp of when the pug was started.
 * @property {number|null} logsID - The logs.tf unique log id, if any.
 * @property {Team[]} teams - The array of teams that played in the pug.
 */
export class Pug {
  id: number;
  map: string;
  winningTeam: number;
  timestamp: Date;
  logsID: number | null;
  teams: Team[];

    /**
     * Creates a new Pug object.
     * @param {number} id - The pug's unique ID.
     * @param {string} map - The map that was/is being played in the pug.
     * @param {Team[]} teams - The 2 teams participating in the pug.
     */
  constructor(id: number, map: string, teams: Team[]) {
	  if (Team.length !== 2) {
	      throw new Error('Teams must only contain 2 Team objects.');
	  } else if (teams[0].color === teams[1].color) {
	      throw new Error('Teams must be opposing colors.');
	  } else {
	    this.id = id;
    	this.teams = teams;
    	this.timestamp = new Date();
  	}
  }

    /**
     * Ends the pug.
     * @param {number} winner - The index of the winner in the teams array.
     * @param {number} logsID - The logs.tf unique log id, if any.
     * @returns {Pug} - The Pug object.
     */
  end(winner: number, logsID: number): Pug {
    this.winningTeam = winner;
    this.logsID = logsID;
    return this;
  }
}
