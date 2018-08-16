export const removeRoleQuery = `UPDATE PLAYERS SET roles = array_remove(roles, $1) WHERE steamid = $2`;

export const addRoleQuery = `UPDATE PLAYERS SET roles = array_append(roles, $1) WHERE steamid = $2;`;

export const setStaffRoleQuery = `UPDATE PLAYERS SET staffRole = $1 WHERE steamid = $2`;

export const loginUserQuery = `INSERT INTO players (steamid, avatar)
           VALUES ($1, $2)
           ON CONFLICT (steamid) DO UPDATE SET avatar = $2
           RETURNING isCaptain, alias, roles, staffRole, isLeagueAdmin`;

export const setLeagueAdminStatusQuery = `UPDATE players SET isLeagueAdmin = $1 WHERE steamid = $2`;
