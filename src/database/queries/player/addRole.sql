UPDATE players SET roles = players.roles || $2
WHERE steamid=$1 AND NOT roles @> $2