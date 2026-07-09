import { useUIStore } from "@/store/useUIStore";

interface SettlementOptions {

    won: boolean;

    stake: number;

    profit: number;

}

export function settlementManager({

    won,

    stake,

    profit,

}: SettlementOptions) {

    const ui = useUIStore.getState();

    if (won) {

        ui.triggerFlash("green");

        ui.addToast({

            type: "success",

            title: "Trade Won",

            amount: profit,

            duration: 3000,

        });

        ui.addFloatingAmount(

            profit,

            "profit"

        );

    } else {

        ui.triggerFlash("red");

        ui.addToast({

            type: "error",

            title: "Trade Lost",

            amount: -stake,

            duration: 3000,

        });

        ui.addFloatingAmount(

            stake,

            "loss"

        );

    }

}