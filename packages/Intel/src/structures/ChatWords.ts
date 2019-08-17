
export class ChatWords {
  whitelistWords: string[] = [];
  blacklistWords: string[] = [];

  constructor() {
    this.updateWords();
  }

  async updateWords() {
   // const res = await db.query('SELECT * FROM chat_words');
  //  const { blacklist, whitelist } = res.rows[0] ? res.rows[0] : { blacklist: [], whitelist: [] };
 //   this.blacklistWords = blacklist ? blacklist : [];
    // this.whitelistWords = whitelist ? whitelist : [];
  }
}
