/**
 * ============================================================================
 * MARKET SESSION TYPES
 * ============================================================================
 * Trading sessions, market calendars and holidays.
 *
 * This file owns:
 * - Trading sessions
 * - Market hours
 * - Holidays
 * - Trading calendar
 * ============================================================================
 */

import {
    MarketStatus,
    TradingSessionStatus
} from "./enums";

/* -------------------------------------------------------------------------- */
/*                              ENUMS                                         */
/* -------------------------------------------------------------------------- */

export enum SessionType {

    PRE_MARKET = "PRE_MARKET",

    REGULAR = "REGULAR",

    AFTER_HOURS = "AFTER_HOURS",

    MAINTENANCE = "MAINTENANCE",

    HOLIDAY = "HOLIDAY",

    WEEKEND = "WEEKEND"
}

export enum TradingDay {

    SUNDAY = 0,

    MONDAY = 1,

    TUESDAY = 2,

    WEDNESDAY = 3,

    THURSDAY = 4,

    FRIDAY = 5,

    SATURDAY = 6
}

/* -------------------------------------------------------------------------- */
/*                          TRADING HOURS                                     */
/* -------------------------------------------------------------------------- */

export interface TradingHours {

    opensAt: string;

    closesAt: string;

    timezone: string;
}

/* -------------------------------------------------------------------------- */
/*                           SESSION                                          */
/* -------------------------------------------------------------------------- */

export interface MarketSession {

    id: string;

    name: string;

    type: SessionType;

    status: TradingSessionStatus;

    opensAt: Date;

    closesAt: Date;

    timezone: string;

    tradable: boolean;
}

/* -------------------------------------------------------------------------- */
/*                        DAILY SESSION                                       */
/* -------------------------------------------------------------------------- */

export interface DailySession {

    day: TradingDay;

    hours: TradingHours;

    enabled: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           HOLIDAY                                          */
/* -------------------------------------------------------------------------- */

export interface MarketHoliday {

    id: string;

    name: string;

    date: Date;

    description?: string;

    marketClosed: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       MARKET CALENDAR                                      */
/* -------------------------------------------------------------------------- */

export interface TradingCalendar {

    timezone: string;

    sessions: DailySession[];

    holidays: MarketHoliday[];

    lastUpdated: Date;
}

/* -------------------------------------------------------------------------- */
/*                        SESSION STATE                                       */
/* -------------------------------------------------------------------------- */

export interface SessionState {

    currentStatus: MarketStatus;

    currentSession?: MarketSession;

    nextSession?: MarketSession;

    serverTime: Date;

    marketOpen: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       MARKET SCHEDULE                                      */
/* -------------------------------------------------------------------------- */

export interface MarketSchedule {

    exchangeId: string;

    calendar: TradingCalendar;

    currentState: SessionState;
}

/* -------------------------------------------------------------------------- */
/*                          COLLECTIONS                                       */
/* -------------------------------------------------------------------------- */

export interface SessionCollection {

    items: MarketSession[];

    total: number;
}

export interface HolidayCollection {

    items: MarketHoliday[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                             LOOKUPS                                        */
/* -------------------------------------------------------------------------- */

export type SessionMap =
    Record<string, MarketSession>;

export type HolidayMap =
    Record<string, MarketHoliday>;

/* -------------------------------------------------------------------------- */
/*                           CALLBACKS                                        */
/* -------------------------------------------------------------------------- */

export type SessionHandler = (

    session: MarketSession

) => void;

export type HolidayHandler = (

    holiday: MarketHoliday

) => void;

export type SessionStateHandler = (

    state: SessionState

) => void;

/* -------------------------------------------------------------------------- */
/*                        DEFAULT VALUES                                      */
/* -------------------------------------------------------------------------- */

export const DEFAULT_TRADING_HOURS: TradingHours = {

    opensAt: "00:00",

    closesAt: "23:59",

    timezone: "UTC"
};

/* -------------------------------------------------------------------------- */
/*                          READONLY TYPES                                    */
/* -------------------------------------------------------------------------- */

export type ReadonlySession =
    Readonly<MarketSession>;

export type ReadonlyCalendar =
    Readonly<TradingCalendar>;

export type ReadonlyHoliday =
    Readonly<MarketHoliday>;

export type ReadonlyState =
    Readonly<SessionState>;

/* -------------------------------------------------------------------------- */
/*                             VERSION                                        */
/* -------------------------------------------------------------------------- */

export interface SessionVersion {

    version: string;

    provider: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           END OF FILE                                      */
/* -------------------------------------------------------------------------- */