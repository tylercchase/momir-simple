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
        !card?.type?.includes("Creature")
    ) {
        continue;
    }

    const cmc = card.mana_cost.split('{').reduce((prev, current) => {
        let current_char = current?.[0];
        if(current_char?.toLowerCase() === 'x') {
            return prev;
        }
        if(isNaN(+current_char)) {
            return prev + 1;
        }
        return prev + parseInt(current_char);
    }, 0)
    console.log(cmc)
    if (!Object.hasOwn(new_contents, cmc ?? 0)) {
        new_contents[cmc ?? 0] = [];
    }
    // @ts-ignore
    new_contents[cmc ?? 0].push({
        name: card.name,
        image_uri: card?.image_uris?.art_crop ?? "",
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
    // {
    //     "name": "Explosive Singularity1",
    //     "mana_cost": "{8}{R}{R}",
    //     "type": "Sorcery",
    //     "image": "https://cards.scryfall.io/large/front/e/6/e6cdd822-44a1-4d58-9de4-69fc56eae255.jpg?1654567601",
    //     "colors": [
    //         "R"
    //     ],
    //     "set": "SFT",
    //     "oracle_text": "As an additional cost to cast this spell, you may tap any number of untapped creatures you control. This spell costs {1} less to cast for each creature tapped this way.\nExplosive Singularity deals 10 damage to any target.",
    //     "collector_number": "266",
    //     "related_cards": [
    //         "Standard Set Red Mythic"
    //     ]
    // }