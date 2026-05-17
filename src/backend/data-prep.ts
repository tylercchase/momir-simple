import type { SlimCard } from "@/shared/cards/slim-card.model";
import type { IScryfallCard } from "@/shared/cards/model";

console.log("Loading cards...");
let file = Bun.file("./src/backend/assets/hellscube.json");
const contents: IScryfallCard[] = await file.json();
console.log("Done loading cards.");

let new_contents: Record<number, SlimCard[]> = {};
for (const card of contents) {
    if (
        card?.type?.includes("Token") ||
        !card?.type?.includes("Creature") ||
        Number.isInteger(parseInt(card.name.slice(-1))) // it seems like cards from real magic end in a number weird
    ) {
        continue;
    }

    const cmc = card.mana_cost.split("{").reduce((prev, current) => {
        let current_char = current?.[0];
        if (current_char?.toLowerCase() === "x") {
            return prev;
        }
        if (isNaN(+current_char)) {
            return prev + 1;
        }
        return prev + parseInt(current_char);
    }, 0);
    if (!Object.hasOwn(new_contents, cmc ?? 0)) {
        new_contents[cmc ?? 0] = [];
    }
    // @ts-ignore
    new_contents[cmc ?? 0].push({
        name: card.name,
        image_uri: card?.image ?? "",
        scryfall_uri: card?.image,
        mana_cost: card.mana_cost,
        power: card.power,
        toughness: card.toughness,
        type_line: card.type,
        oracle_text: card.oracle_text,
    });
}

let new_file = Bun.file("./src/backend/assets/hellscube-formatted-cards.json");
Bun.write(new_file, JSON.stringify(new_contents));
