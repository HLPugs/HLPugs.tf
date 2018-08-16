import { QueryResult } from 'pg';
import db              from '../database/db';
import { Punishment }  from '../structures/Punishment';
    /**
 * Retrieves the most recent active Punishment of a Player
 * @param {string} steamid The Player to request the Punishment information from
 * @returns {Promise<object>} Ban reason, expiration, and creator's SteamID and steam avatar
 */
export const getActivePunishments = async(steamid: string): Promise<Punishment[]> => {

  // Retrieve Punishment reason, expiration, and creator's SteamID and avatar for all active activePunishments
  const query = {
    text: `SELECT
    punishment
    , data
        FROM (
            SELECT
    punishment
    , timeline -> 'punishments' -> (json_array_length(timeline -> 'punishments') - 1) AS data
      , rank()
  OVER (PARTITION BY
  punishment
  ORDER BY
  timeline -> 'punishments' -> 0 ->> 'issued_on' DESC) AS r
  FROM
  punishments
  WHERE
  steamid = $1
  AND timeline::text <> '{}'::text) AS dt
  WHERE
  r = 1`,
    values: [steamid],
  };

  const res: QueryResult = await db.query(query);
  const punishments = res.rows;

  // Exclude inactive activePunishments
  return punishments.filter((x: Punishment) => new Date(x.data.expiration) > new Date());
};
