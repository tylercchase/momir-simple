export interface CardDB {
    [cmc: number]: SlimCard[];
}

export interface SlimCard {
    name: string;
    image_uri: string;
    scryfall_uri: string;
    mana_cost: string | undefined | null;
    power: string | undefined | null;
    toughness: string | undefined | null;
    type_line: string | undefined | null;
    oracle_text: string | undefined | null;
}
