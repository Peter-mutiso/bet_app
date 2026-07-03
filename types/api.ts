import {

    Bet

} from "./bet";

import {

    Activity

} from "./activity";



export interface Wallet {

    balance: number;

    bonus: number;

    openBets: number;

    dailyProfit: number;

    activeBets: Bet[];

    transactions: IDBTransaction[];

    activities: Activity[];

}