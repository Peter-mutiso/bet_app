/**
 * ============================================================================
 * PROPOSAL CHANNEL
 * ============================================================================
 * Handles proposal requests and responses.
 * ============================================================================
 */

import { BaseChannel } from "./base-channel";
import { WebSocketManager } from "../manager";
import { WebSocketMessage } from "../types";
import { messageFactory } from "../message";
import { logger } from "../logger";

import {

    Proposal

} from "../../../models/proposal";

/* -------------------------------------------------------------------------- */
/*                           CHANNEL                                          */
/* -------------------------------------------------------------------------- */

export class ProposalChannel extends BaseChannel<Proposal> {

    private readonly proposals =

        new Map<string, Proposal>();

    constructor(

        manager: WebSocketManager

    ) {

        super(
    manager,
    {
        name: "proposal",
        autoSubscribe: false
    }
);

        this.initialize();

    }

    /* ---------------------------------------------------------------------- */
    /*                    REQUEST                                             */
    /* ---------------------------------------------------------------------- */

    public async request(

        proposal: Partial<Proposal>

    ): Promise<void> {

        this.ensureConnected();

        const message =

            messageFactory.request(

                "proposal",

                proposal,

                this.name()

            );

        const sent =

            this.manager.send(message);

        if (!sent) {

            throw new Error(

                "Unable to request proposal."

            );

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                 SUBSCRIBE / UNSUBSCRIBE                                */
    /* ---------------------------------------------------------------------- */

    public subscribe():

    void{

        // Proposals are request-driven.

    }

    public unsubscribe():

    void {

        this.proposals.clear();

    }
    /* ---------------------------------------------------------------------- */
    /*                    VALIDATION                                          */
    /* ---------------------------------------------------------------------- */

    private validateProposal(

        proposal: Proposal

    ): boolean {

        return (

            typeof proposal.id === "string" &&

            proposal.id.length > 0

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    LOOKUP                                              */
    /* ---------------------------------------------------------------------- */

    public get(

        id: string

    ): Proposal | undefined {

        return this.proposals.get(id);

    }

    public has(

        id: string

    ): boolean {

        return this.proposals.has(id);

    }

    public proposalIds():

    readonly string[] {

        return [

            ...this.proposals.keys()

        ];

    }

    /* ---------------------------------------------------------------------- */
    /*                    EXPIRY                                              */
    /* ---------------------------------------------------------------------- */

    public isExpired(

        proposal: Proposal

    ): boolean {

        if (

            proposal.expiry === undefined ||

            proposal.expiry === null

        ) {

            return false;

        }

        return (

            Date.now() >=

            new Date(

                proposal.expiry

            ).getTime()

        );

    }

    public removeExpired(): void {

        for (

            const [

                id,

                proposal

            ]

            of this.proposals

        ) {

            if (

                this.isExpired(

                    proposal

                )

            ) {

                this.proposals.delete(

                    id

                );

            }

        }

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public override statistics() {

        return {

            ...super.statistics(),

            proposals:

                this.proposals.size

        };

    }

    public override healthy(): boolean {

        return (

            super.healthy()

        );

    }

    protected override async onSubscribed():

    Promise<void> {

        logger.info(

            "Proposal channel ready."

        );

    }

    protected override async onUnsubscribed():

    Promise<void> {

        logger.info(

            "Proposal cache cleared."

        );

    }
        /* ---------------------------------------------------------------------- */
    /*                     LATEST PROPOSAL                                    */
    /* ---------------------------------------------------------------------- */

    private latestProposal?: Proposal;

    public latest():

    Proposal | undefined {

        return this.latestProposal;

    }

    /* ---------------------------------------------------------------------- */
    /*                    REMOVE                                              */
    /* ---------------------------------------------------------------------- */

    public remove(

        id: string

    ): boolean {

        return this.proposals.delete(id);

    }

    public clear(): void {

        this.proposals.clear();

        this.latestProposal = undefined;

    }

    /* ---------------------------------------------------------------------- */
    /*                    HANDLE MESSAGE                                      */
    /* ---------------------------------------------------------------------- */

    protected override async handleMessage(

        message: WebSocketMessage<Proposal>

    ): Promise<void> {

        if (

            !this.canProcess()

        ) {

            return;

        }

        const proposal =

            message.payload;

        if (

            !this.validateProposal(

                proposal

            )

        ) {

            logger.warn(

                "Invalid proposal received."

            );

            return;

        }

        this.removeExpired();

        this.proposals.set(

            proposal.id,

            proposal

        );

        this.latestProposal =

            proposal;

        this.emitSafe(

            proposal

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    EXPORT                                              */
    /* ---------------------------------------------------------------------- */

    public export():

    readonly Proposal[] {

        return Object.freeze(

            [

                ...this.proposals.values()

            ]

        );

    }

    /* ---------------------------------------------------------------------- */
    /*                    CACHE                                               */
    /* ---------------------------------------------------------------------- */

    public size(): number {

        return this.proposals.size;

    }

    public isEmpty(): boolean {

        return this.proposals.size === 0;

    }

    /* ---------------------------------------------------------------------- */
    /*                    RESET                                               */
    /* ---------------------------------------------------------------------- */

    public override reset(): void {

        super.reset();

        this.clear();

    }

    /* ---------------------------------------------------------------------- */
    /*                    INFORMATION                                         */
    /* ---------------------------------------------------------------------- */

    public override information() {

        return {

            ...super.information(),

            proposals:

                this.proposals.size,

            latestProposal:

                this.latestProposal?.id

        };

    }
        /* ---------------------------------------------------------------------- */
    /*                    CLEANUP                                             */
    /* ---------------------------------------------------------------------- */

    public cleanup(): void {

        this.removeExpired();

    }

    /* ---------------------------------------------------------------------- */
    /*                    CACHE HELPERS                                       */
    /* ---------------------------------------------------------------------- */

    public values():

    readonly Proposal[] {

        return [

            ...this.proposals.values()

        ];

    }

    public entries():

    readonly (readonly [string, Proposal])[] {

        return [

            ...this.proposals.entries()

        ];

    }

    /* ---------------------------------------------------------------------- */
    /*                    DESTROY                                             */
    /* ---------------------------------------------------------------------- */

    public override destroy(): void {

        this.clear();

        super.destroy();

        logger.info(

            "Proposal channel destroyed."

        );

    }

}

/* -------------------------------------------------------------------------- */
/*                        FACTORY                                             */
/* -------------------------------------------------------------------------- */

export function createProposalChannel(

    manager: WebSocketManager

): ProposalChannel {

    return new ProposalChannel(

        manager

    );

}