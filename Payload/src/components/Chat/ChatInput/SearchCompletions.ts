import allEmojis from 'emoji-mart/data/all.json';
import { CustomEmoji } from 'emoji-mart';
import { CompletionItem } from '../../../common/types';

const allEmojisList = Object.keys(allEmojis.emojis);

const SearchEmojis = (fragment: string, customEmojis: CustomEmoji[]) => {
	const query = fragment.slice(1).toLowerCase();

	if (!fragment.startsWith(':') || query.length <= 1) {
		// If query is only 1 character or isn't actually a emoji search, return with blank
		return {
			autoCompleteIndex: 0,
			emojiCompletions: []
		};
	}

	const customExact: CompletionItem[] = customEmojis
		.filter(e => e.short_names[0].substring(0, query.length) === query)
		.map(e => ({
			customName: e.short_names[0],
			url: e.imageUrl
		}));

	const allExact: CompletionItem[] = allEmojisList
		.filter((e: string) => e.substring(0, query.length) === query)
		.map((e: string) => ({ name: e }));

	const exactCompletions: CompletionItem[] = customExact.concat(allExact);

	const customAny: CompletionItem[] = customEmojis
		.filter(e => e.short_names[0].includes(query))
		.map(e => ({
			customName: e.short_names[0],
			url: e.imageUrl
		}));

	const allAny: CompletionItem[] = allEmojisList
		.filter((e: string) => e.includes(query))
		.map((e: string) => ({ name: e }));

	const anyCompletions: CompletionItem[] = customAny.concat(allAny);

	const notInCompletions = (completion: CompletionItem) => {
		return !exactCompletions.some(
			e => e.name === completion.name || e.customName === completion.customName
		);
	};

	const finalCompletions = exactCompletions
		.concat(anyCompletions.filter(e => notInCompletions(e)))
		.slice(0, 8);

	return {
		autoCompleteIndex: 0,
		emojiCompletions: finalCompletions
	};
};

const SearchMentions = (fragment: string, mentions: string[]) => {
	const query = fragment.slice(1).toLowerCase();

	const exactMentions = mentions.filter(
		m => m.toLowerCase().substring(0, query.length) === query
	);

	const anyMentions = mentions.filter(m => m.toLowerCase().includes(query));

	const mentionCompletions = exactMentions
		.concat(anyMentions.filter(m => exactMentions.indexOf(m) === -1))
		.slice(0, 8);

	return {
		autoCompleteIndex: 0,
		mentionCompletions: mentionCompletions
	};
};

export { SearchEmojis, SearchMentions };
