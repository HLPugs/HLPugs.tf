import { LinqRepository } from 'typeorm-linq-repository';
import BlacklistedWordEntity from '../entities/BlacklistedWordEntity';
import ValidateClass from '../utils/ValidateClass';
import WhitelistedWordEntity from '../entities/WhitelistedWordEntity';

export default class ChatWordService {
	async addBlacklistedWord(word: string) {
		const repository = new LinqRepository(BlacklistedWordEntity);

		if (
			(await repository
				.getOne()
				.where(x => x.word)
				.equal(word)
				.count()) === 0
		) {
			const blacklistedWord = new BlacklistedWordEntity();
			blacklistedWord.word = word;
			await repository.create(ValidateClass(blacklistedWord));
		}
	}

	async addWhitelistedWord(word: string) {
		const repository = new LinqRepository(WhitelistedWordEntity);

		if (
			(await repository
				.getOne()
				.where(x => x.word)
				.equal(word)
				.count()) === 0
		) {
			const whitelistedWord = new WhitelistedWordEntity();
			whitelistedWord.word = word;
			await repository.create(ValidateClass(whitelistedWord));
		}
	}

	async getBlacklistedWords(): Promise<string[]> {
		const repository = new LinqRepository(BlacklistedWordEntity);
		return (await repository.getAll()).map(x => x.word);
	}

	async getWhitelistedWords(): Promise<string[]> {
		const repository = new LinqRepository(WhitelistedWordEntity);
		return (await repository.getAll()).map(x => x.word);
	}
}
