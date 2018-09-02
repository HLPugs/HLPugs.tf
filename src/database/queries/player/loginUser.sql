INSERT INTO players (steamid, avatar)
           VALUES ($1, $2)
           ON CONFLICT (steamid) DO UPDATE SET avatar = $2
           RETURNING isCaptain, alias, roles, staffRole, isLeagueAdmin, settings