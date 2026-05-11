import type { IScryfallCard } from "./model";
import type { CardDB, FullSlimCard, SlimCard } from "./slim-card.model";

export function parseMessage(message: string, cardDB: CardDB): FullSlimCard[] {
    message = message.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");

    const pieces = message.split(" ");
    const cards: FullSlimCard[] = [];

    for (let i = 1; i <= Math.min(pieces.length, 8); i++) {
        for (let y = 0; y + i <= pieces.length; y++) {
            let word = pieces
                .slice(y, y + i)
                .join(" ")
                .toLowerCase();
            const card = cardDB[word];
            if (card && word.length > 0) {
                cards.push({
                    name: word,
                    ...card,
                });
            }
        }
    }
    return cards;
}
