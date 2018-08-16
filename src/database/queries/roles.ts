export const addRoleQuery = `UPDATE PLAYERS set roles = array_remove(roles, $1);
UPDATE PLAYERS SET roles = array_append(roles, $1);
`;

export const loginUserQuery = `INSERT INTO players (steamid, avatar)
           VALUES ($1, $2)
           ON CONFLICT (steamid) DO UPDATE SET avatar = $2
           RETURNING isCaptain, alias, roles, staffRole, isLeagueAdmin`;
