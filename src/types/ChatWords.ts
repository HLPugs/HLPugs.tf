import db from '../database/db';

export class ChatWords {
  whitelistWords: string[] = [];
  blacklistWords: string[] = [];

  constructor() {
    this.updateWords();
  }

  async updateWords() {
    const { rows: [{ blacklist, whitelist }] } = await db.query('SELECT * FROM chat_words');
    this.blacklistWords = blacklist;
    this.whitelistWords = whitelist;
  }
}
