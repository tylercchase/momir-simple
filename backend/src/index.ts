import type { IScryfallCard } from "../../shared/cards/model";

console.log("Loading cards...");
let file = Bun.file("./assets/default-cards.json");
const contents: IScryfallCard[] = await file.json();
console.log("Done loading cards.");
// TOOD: possibly setup this in the root directory to pull from both backend and frontend
const server = Bun.serve({
    routes: {
        "/api/creature/:id": (req) => {
            return new Response(
                `Finding a creature with mana cost: ${req.params.id}`,
            );
        },
    },
});

console.log(`Server running at ${server.url}`);
