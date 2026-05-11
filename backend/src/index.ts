import type { SlimCard } from "../../shared/cards/slim-card.model";

console.log("Loading cards...");
let file = Bun.file("./assets/formatted-cards.json");
const card_contents: Record<number, SlimCard[]> = await file.json();
console.log("Done loading cards.");
// TOOD: possibly setup this in the root directory to pull from both backend and frontend
const server = Bun.serve({
    routes: {
        "/api/creature/:id": (req) => {
            console.log(`Finding a creature with mana cost: ${req.params.id}`);
            return new Response(
                JSON.stringify(
                    card_contents[req.params.id][
                        [
                            Math.floor(
                                Math.random() *
                                    card_contents[req.params.id].length,
                            ),
                        ]
                    ],
                ),
            );
        },
    },
});

console.log(`Server running at ${server.url}`);
