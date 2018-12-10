UPDATE players SET roles = players.roles || $1
WHERE steamid=$2 AND NOT roles @> $1