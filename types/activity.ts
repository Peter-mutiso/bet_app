import {

    Timestamped,

    UUID

} from "./common";

export interface Activity extends Timestamped {

    id: UUID;

    title: string;

    description: string;

}