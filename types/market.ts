import {

    Timestamped,

    UUID

} from "./common";

export interface Market extends Timestamped {

    id: UUID;

    name: string;

    symbol: string;

    category: string;

    favorite: boolean;

    price: number;

    change: number;

    isOpen: boolean;

}