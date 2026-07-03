import {

    createContext,

    useContext,

    useMemo,

    useState,

    ReactNode

} from "react";

import {

    Wallet,

    Market,

    Bet,

    Activity,

} from "../../types";

type Transaction = unknown;

interface DashboardContextType {

    wallet: Wallet | null;

    markets: Market[];

    activeBets: Bet[];

    activities: Activity[];

    transactions: Transaction[];

    connected: boolean;

    setWallet(wallet: Wallet): void;

    setMarkets(markets: Market[]): void;

    setActiveBets(bets: Bet[]): void;

    setActivities(items: Activity[]): void;

    setTransactions(items: Transaction[]): void;

    setConnected(value: boolean): void;

}

const DashboardContext =

    createContext<DashboardContextType | null>(

        null

    );

interface Props {

    children: ReactNode;

}

export function DashboardProvider({

    children

}: Props) {

    const [

        wallet,

        setWallet

    ] =

        useState<Wallet | null>(

            null

        );

    const [

        markets,

        setMarkets

    ] =

        useState<Market[]>([]);

    const [

        activeBets,

        setActiveBets

    ] =

        useState<Bet[]>([]);

    const [

        activities,

        setActivities

    ] =

        useState<Activity[]>([]);

    const [

        transactions,

        setTransactions

    ] =

        useState<Transaction[]>([]);

    const [

        connected,

        setConnected

    ] =

        useState(false);

    const value =

        useMemo(

            () => ({

                wallet,

                markets,

                activeBets,

                activities,

                transactions,

                connected,

                setWallet,

                setMarkets,

                setActiveBets,

                setActivities,

                setTransactions,

                setConnected

            }),

            [

                wallet,

                markets,

                activeBets,

                activities,

                transactions,

                connected

            ]

        );

    return (

        <DashboardContext.Provider

            value={value}

        >

            {children}

        </DashboardContext.Provider>

    );

}

export function useDashboard() {

    const context =

        useContext(

            DashboardContext

        );

    if (

        !context

    ) {

        throw new Error(

            "useDashboard must be used inside DashboardProvider."

        );

    }

    return context;

}