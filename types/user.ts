import {

    Timestamped,

    UUID

} from "./common";

export interface User extends Timestamped {

    id: UUID;

    username: string;

    email: string;

    firstName: string;

    lastName: string;

    avatar?: string;

    verified: boolean;

}