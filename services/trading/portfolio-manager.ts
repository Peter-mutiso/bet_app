/**
 * ============================================================================
 * PORTFOLIO MANAGER
 * ============================================================================
 */

import {

    Trade

} from "../../types";

export class PortfolioManager {

    private positions: Trade[] = [];

    add(

        trade: Trade

    ) {

        this.positions.push(

            trade

        );

    }

    remove(

        id: string

    ) {

        this.positions =

            this.positions.filter(

                trade =>

                    trade.id !== id

            );

    }

    update(

        trade: Trade

    ) {

        const index =

            this.positions.findIndex(

                position =>

                    position.id === trade.id

            );

        if (

            index >= 0

        ) {

            this.positions[index] =

                trade;

        }

    }

    active() {

        return this.positions.filter(

            trade =>

                trade.status === "OPEN"

        );

    }

    history() {

        return this.positions;

    }

    clear() {

        this.positions = [];

    }

}