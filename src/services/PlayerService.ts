import { Player } from '../entities/Player';
class PlayerService {

  static async getMatchesForProfile(steamid: string, pageSize: number, currentPage: number) {
    const startIndex = (pageSize - 1) * currentPage;
    const endIndex = startIndex + pageSize;
    // tslint:disable-next-line: max-line-length
   // const [rows, fields] = await db.query('SELECT p.map, p.winner, p.date, p.logslink, ps.team, ps.tf2class, ps.captain FROM pugs p INNER JOIN syncpugs ps ON p.idpugs = ps.pugid AND ps.steamid = ? ORDER BY p.date DESC LIMIT ?,?', [steamid, startIndex, endIndex]);
   // return rows;
  }

  static async getPlayerBySteamid(steamid: string): Promise<Player> {
    // tslint:disable-next-line: max-line-length
  //  const [[player], fields] = await db.query('SELECT r.admin, r.moderator, r.patron, r.voiceactor, s.alias, p.pugs, p.wins, p.losses, p.captain, p.subsin, p.subsout, p.steamid FROM players p INNER JOIN settings s ON p.steamid=s.steamid AND p.steamid = ? LEFT JOIN roles r ON p.steamid = r.steamid', steamid);
    const player = new Player();
   return player as Player;
  }
}

//     {
//       // tslint:disable-next-line: max-line-length
//       const [[matches], fields] = await db.query('SELECT tf2class, COUNT(*) as count FROM syncpugs WHERE steamid = ? GROUP BY tf2class ORDER BY tf2class ASC', steamid);
//       player.pugs = matches;
//     }
//     {
//       // tslint:disable-next-line: max-line-length
//       const [rows, fields] = await db.query('SELECT tf2class, COUNT(*) as count FROM syncpugs WHERE steamid = ? GROUP BY tf2class ORDER BY tf2class ASC', steamid);
//       player.pugs = rows;
//     }
//     {
//       // tslint:disable-next-line: max-line-length
//       const [[rows], fields] = await db.query('SELECT s.tf2class, COUNT(*) as count FROM syncpugs s INNER JOIN pugs p WHERE p.winner != s.team AND s.steamid = ? AND p.idpugs = s.pugid GROUP BY tf2class', steamid);
//     }
//     {
//       // tslint:disable-next-line: max-line-length
//       const [rows, fields] = await db.query('SELECT s.team, p.winner, s.tf2class, COUNT(*) as count FROM syncpugs s INNER JOIN pugs p WHERE s.steamid = ? AND p.idpugs = s.pugid GROUP BY tf2class, team, winner', steamid);
//       // tslint:disable-next-line: one-variable-per-declaration
//       const wonGames: any[] = [], lostGames: any[] = [];
//       rows.forEach((match: any) => {
//         if (match.winner == match.team) {
//           wonGames.push(match);
//         } else {
//           lostGames.push(match);
//         }
//       });
//       player.wonGames = wonGames;
//       player.lostGames = lostGames;
//     }
//     return player;
//   }
// }

export default PlayerService;
