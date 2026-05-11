import { describe, expect, test } from "bun:test";
import { parseMessage } from "./parser";
describe("parser", async () => {
    let file = Bun.file("./card-output.json");
    const contents = await file.json();

    test("single word works", () => {
        const result = parseMessage("fireball", contents);
        expect(result).toBeArrayOfSize(1);
        expect(result).toMatchObject([
            {
                name: "fireball",
            },
        ]);
    });

    test("Basic sentance", () => {
        const result = parseMessage("This is a fireball", contents);
        expect(result).toBeArrayOfSize(1);
        expect(result).toMatchObject([
            {
                name: "fireball",
            },
        ]);
    });

    test("Basic sentance with punctuation", () => {
        const result = parseMessage("This is a fireball.", contents);
        expect(result).toBeArrayOfSize(1);
        expect(result).toMatchObject([
            {
                name: "fireball",
            },
        ]);
    });

    test("Basic sentance with multiple matches", () => {
        const result = parseMessage(
            "This is a fireball that does a brainstorm.",
            contents,
        );
        expect(result).toBeArrayOfSize(2);
        expect(result).toMatchObject([
            {
                name: "fireball",
            },
            {
                name: "brainstorm",
            },
        ]);
    });
    test("Basic sentance with a two word card", () => {
        const result = parseMessage("This is a moss viper.", contents);
        expect(result).toBeArrayOfSize(1);
        expect(result).toMatchObject([
            {
                name: "moss viper",
            },
        ]);
    });
});
