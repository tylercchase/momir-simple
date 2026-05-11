export interface CardDB {
    [card_name: string]: SlimCard;
}

export interface SlimCard {
    image_uri: string;
    scryfall_uri: string;
}

export interface FullSlimCard {
    name: string;
    image_uri: string;
    scryfall_uri: string;
}
