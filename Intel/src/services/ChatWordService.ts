import { LinqRepository } from 'typeorm-linq-repository';
import BlacklistedWord from '../entities/BlacklistedWord';
import ValidateClass from '../utils/ValidateClass';
import WhitelistedWord from '../entities/WhitelistedWord';

export default class ChatWordService {
	async addBlacklistedWord(word: string) {
		const repository = new LinqRepository(BlacklistedWord);

		if (
			(await repository
				.getOne()
				.where(x => x.word)
				.equal(word)
				.count()) === 0
		) {
			const blacklistedWord = new BlacklistedWord();
			blacklistedWord.word = word;
			await repository.create(ValidateClass(blacklistedWord));
		}
	}

	async addWhitelistedWord(word: string) {
		const repository = new LinqRepository(WhitelistedWord);

		if (
			(await repository
				.getOne()
				.where(x => x.word)
				.equal(word)
				.count()) === 0
		) {
			const whitelistedWord = new WhitelistedWord();
			whitelistedWord.word = word;
			await repository.create(ValidateClass(whitelistedWord));
		}
	}

	async getBlacklistedWords(): Promise<string[]> {
		const repository = new LinqRepository(BlacklistedWord);
		return (await repository.getAll()).map(x => x.word);
	}

	async getWhitelistedWords(): Promise<string[]> {
		const repository = new LinqRepository(WhitelistedWord);
		return (await repository.getAll()).map(x => x.word);
	}
}
