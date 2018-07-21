import db from '../database/db';
import { punishment } from '../common/types';

/**
 * Retrieves the most recent active punishment of a player
 * @param {string} steamid The player to request the punishment information from
 * @returns {Promise<object>} Ban reason, expiration, and creator's SteamID and steam avatar
 */
export async function getActivePunishments(steamid: string): Promise<object> {

  // Retrieve punishment reason, expiration, creator's SteamID and avatar for all active punishments
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
  // TODO exclude inactive punishments in query, not in node

  return await db.query(query)
    .then(res => res.rows
        // Exclude inactive punishments
        .filter((x: punishment) => new Date(x.data.expiration) > new Date()));
}
