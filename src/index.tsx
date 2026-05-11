import { serve } from "bun";
import index from "./index.html";
import type { SlimCard } from "./shared/cards/slim-card.model";
import { printMagicCard } from "./backend/print";

console.log("Loading cards...");
let file = Bun.file("./src/backend/assets/formatted-cards.json");
const card_contents: Record<number, SlimCard[]> = await file.json();
console.log("Done loading cards.");
const server = serve({
    routes: {
        // Serve index.html for all unmatched routes.
        "/*": index,
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
        "/api/print": async (req) => {
            const body = await req.json();

            await printMagicCard(body);
            return new Response(JSON.stringify({ status: "printed" }));
        },
    },
    error(error) {
        return new Response(
            JSON.stringify({
                error: `${error}`,
            }),
        );
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
});

console.log(`🚀 Server running at ${server.url}`);
