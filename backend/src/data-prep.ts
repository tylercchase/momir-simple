import type { IScryfallCard } from "../../shared/cards/model";
import type { SlimCard } from "../../shared/cards/slim-card.model";

console.log("Loading cards...");
let file = Bun.file("./assets/default-cards.json");
const contents: IScryfallCard[] = await file.json();
console.log("Done loading cards.");

let new_contents: Record<number, SlimCard[]> = {};
for (const card of contents) {
    if (
        !card.games.includes("paper") ||
        card?.type_line?.includes("Token") ||
        !card?.type_line?.includes("Creature")
    ) {
        continue;
    }
    if (!Object.hasOwn(new_contents, card.cmc)) {
        new_contents[card.cmc] = [];
    }
    // @ts-ignore
    new_contents[card.cmc].push({
        name: card.name,
        image_uri: card?.image_uris?.png ?? "",
        scryfall_uri: card?.scryfall_uri,
        mana_cost: card.mana_cost,
        power: card.power,
        toughness: card.toughness,
        type_line: card.type_line,
        oracle_text: card.oracle_text,
    });
}

let new_file = Bun.file("./assets/formatted-cards.json");
Bun.write(new_file, JSON.stringify(new_contents));
