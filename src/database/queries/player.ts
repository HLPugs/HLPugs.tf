export const removeRoleQuery = `UPDATE PLAYERS SET roles = array_remove(roles, $1) WHERE steamid = $2`;

export const addRoleQuery = `UPDATE PLAYERS SET roles = array_append(roles, $1) WHERE steamid = $2;`;

export const setStaffRoleQuery = `UPDATE PLAYERS SET staffRole = $1 WHERE steamid = $2`;

export const loginUserQuery = `INSERT INTO players (steamid, avatar)
           VALUES ($1, $2)
           ON CONFLICT (steamid) DO UPDATE SET avatar = $2
           RETURNING isCaptain, alias, roles, staffRole, isLeagueAdmin, settings`;

export const setLeagueAdminStatusQuery = `UPDATE players SET isLeagueAdmin = $1 WHERE steamid = $2`;

export const getActivePunishmentsQuery = `SELECT
    type
    , data
        FROM (
            SELECT
    type
    , timeline -> 'punishments' -> (json_array_length(timeline -> 'punishments') - 1) AS data
      , rank()
  OVER (PARTITION BY
  type
  ORDER BY
  timeline -> 'punishments' -> 0 ->> 'issued_on' DESC) AS r
  FROM
  punishments
  WHERE
  steamid = $1
  AND timeline::text <> '{}'::text) AS dt
  WHERE
  r = 1`;

export const updateSettingsQuery = `UPDATE players SET settings = $1 WHERE steamid = $2`;

export const updateIPQuery = `UPDATE players SET ips = players.ips || $2
WHERE steamid=$1 AND NOT ips @> $2`;
