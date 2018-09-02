UPDATE players SET ips = players.ips || $2
WHERE steamid=$1 AND NOT ips @> $2