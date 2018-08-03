import allEmojis from 'emoji-mart/data/all.json';
import { CustomEmoji } from 'emoji-mart';
import { CompletionItem } from '../../../common/types';

const notInCompletions = (query: string, completions: CompletionItem[]) => {
    for (const emoji of completions) {
        if (emoji.name === query || emoji.customName === query) {
            return true;
        }
    }

    return false;
};

const SearchEmojis = (fragment: string, input: React.RefObject<HTMLTextAreaElement>, customEmojis: CustomEmoji[]) => {
    const query = fragment.slice(1);

    if (fragment.startsWith(':') && query.length > 1) {
        let completions: CompletionItem[] = [];

        for (const emoji of customEmojis) {
            if (completions.length >= 8) {
                break;
            }

            if (emoji.short_names[0].substring(0, query.length) === query) {
                completions.push({
                    customName: emoji.short_names[0],
                    url: emoji.imageUrl
                });
            }
        }

        for (const emoji in allEmojis.emojis) {
            if (emoji.substring(0, query.length) === query) {
                if (completions.length >= 8) {
                    break;
                }

                completions.push({
                    name: emoji
                });
            }
        }

        for (const emoji of customEmojis) {
            if (completions.length >= 8) {
                break;
            }

            if (emoji.short_names[0].includes(query) && notInCompletions(query, completions)) {
                completions.push({
                    customName: emoji.short_names[0],
                    url: emoji.imageUrl
                });
            }
        }

        for (const emoji in allEmojis.emojis) {
            if (emoji.includes(query) && notInCompletions(query, completions)) {
                if (completions.length >= 8) {
                    break;
                }

                completions.push({
                    name: emoji
                });
            }
        }

        return {
            autoCompleteIndex: 0,
            emojiCompletions: completions
        };
    }

    return {
        autoCompleteIndex: 0,
        emojiCompletions: []
    };
};

export default SearchEmojis;