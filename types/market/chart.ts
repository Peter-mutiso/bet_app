/**
 * ============================================================================
 * CHART TYPES
 * ============================================================================
 * Professional charting models for financial markets.
 *
 * Used by:
 * - Trading terminal
 * - TradingView integration
 * - Technical indicators
 * - Strategy tester
 * - Replay engine
 * - AI visualization
 * ============================================================================
 */

import { Timeframe, Theme } from "../common";
import { Candle } from "./candle";
import { Instrument } from "./market";

/* -------------------------------------------------------------------------- */
/*                               ENUMS                                        */
/* -------------------------------------------------------------------------- */

export enum ChartType {

    CANDLESTICK = "CANDLESTICK",

    LINE = "LINE",

    AREA = "AREA",

    BAR = "BAR",

    HEIKIN_ASHI = "HEIKIN_ASHI",

    HOLLOW_CANDLE = "HOLLOW_CANDLE",

    BASELINE = "BASELINE"
}

export enum ChartScale {

    LINEAR = "LINEAR",

    LOGARITHMIC = "LOGARITHMIC"
}

export enum CrosshairMode {

    NONE = "NONE",

    VERTICAL = "VERTICAL",

    HORIZONTAL = "HORIZONTAL",

    BOTH = "BOTH"
}

export enum GridStyle {

    SOLID = "SOLID",

    DASHED = "DASHED",

    DOTTED = "DOTTED"
}

export enum PriceAxisPosition {

    LEFT = "LEFT",

    RIGHT = "RIGHT"
}

/* -------------------------------------------------------------------------- */
/*                          CHART DIMENSIONS                                  */
/* -------------------------------------------------------------------------- */

export interface ChartDimensions {

    width: number;

    height: number;

    responsive: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         PRICE SCALE                                        */
/* -------------------------------------------------------------------------- */

export interface PriceScale {

    minimum?: number;

    maximum?: number;

    autoScale: boolean;

    scale: ChartScale;

    position: PriceAxisPosition;
}

/* -------------------------------------------------------------------------- */
/*                          TIME SCALE                                        */
/* -------------------------------------------------------------------------- */

export interface TimeScale {

    visibleBars: number;

    rightOffset: number;

    lockVisibleRange: boolean;

    showSeconds: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             GRID                                            */
/* -------------------------------------------------------------------------- */

export interface ChartGrid {

    visible: boolean;

    style: GridStyle;

    horizontalLines: boolean;

    verticalLines: boolean;
}

/* -------------------------------------------------------------------------- */
/*                             CROSSHAIR                                      */
/* -------------------------------------------------------------------------- */

export interface Crosshair {

    enabled: boolean;

    mode: CrosshairMode;

    showPriceLabel: boolean;

    showTimeLabel: boolean;
}

/* -------------------------------------------------------------------------- */
/*                            CHART CONFIG                                    */
/* -------------------------------------------------------------------------- */

export interface ChartConfiguration {

    type: ChartType;

    timeframe: Timeframe;

    theme: Theme;

    dimensions: ChartDimensions;

    grid: ChartGrid;

    crosshair: Crosshair;

    priceScale: PriceScale;

    timeScale: TimeScale;

    animation: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                CHART                                       */
/* -------------------------------------------------------------------------- */

export interface TradingChart {

    id: string;

    instrument: Instrument;

    candles: Candle[];

    configuration: ChartConfiguration;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           CHART SNAPSHOT                                   */
/* -------------------------------------------------------------------------- */

export interface ChartSnapshot {

    chartId: string;

    timeframe: Timeframe;

    candleCount: number;

    capturedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           VIEWPORT                                         */
/* -------------------------------------------------------------------------- */

export interface ChartViewport {

    startIndex: number;

    endIndex: number;

    zoomLevel: number;

    offset: number;
}
/* -------------------------------------------------------------------------- */
/*                          DRAWING TOOLS                                     */
/* -------------------------------------------------------------------------- */

export enum DrawingToolType {

    TREND_LINE = "TREND_LINE",

    HORIZONTAL_LINE = "HORIZONTAL_LINE",

    VERTICAL_LINE = "VERTICAL_LINE",

    RAY = "RAY",

    ARROW = "ARROW",

    RECTANGLE = "RECTANGLE",

    CIRCLE = "CIRCLE",

    ELLIPSE = "ELLIPSE",

    TRIANGLE = "TRIANGLE",

    FIBONACCI_RETRACEMENT = "FIBONACCI_RETRACEMENT",

    FIBONACCI_EXTENSION = "FIBONACCI_EXTENSION",

    FIBONACCI_FAN = "FIBONACCI_FAN",

    PITCHFORK = "PITCHFORK",

    TEXT = "TEXT"
}

/* -------------------------------------------------------------------------- */
/*                           CHART POINT                                      */
/* -------------------------------------------------------------------------- */

export interface ChartPoint {

    time: Date;

    price: number;
}

/* -------------------------------------------------------------------------- */
/*                          DRAWING STYLE                                     */
/* -------------------------------------------------------------------------- */

export interface DrawingStyle {

    color: string;

    lineWidth: number;

    opacity: number;

    lineStyle: GridStyle;

    filled: boolean;

    visible: boolean;

    locked: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           DRAWING OBJECT                                   */
/* -------------------------------------------------------------------------- */

export interface DrawingObject {

    id: string;

    tool: DrawingToolType;

    points: ChartPoint[];

    style: DrawingStyle;

    selected: boolean;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           TEXT ANNOTATION                                  */
/* -------------------------------------------------------------------------- */

export interface TextAnnotation extends DrawingObject {

    text: string;

    fontSize: number;

    fontFamily: string;

    rotation: number;
}

/* -------------------------------------------------------------------------- */
/*                           PRICE MARKER                                     */
/* -------------------------------------------------------------------------- */

export interface PriceMarker {

    id: string;

    price: number;

    label: string;

    visible: boolean;

    color: string;
}

/* -------------------------------------------------------------------------- */
/*                           TRADE MARKER                                     */
/* -------------------------------------------------------------------------- */

export enum TradeMarkerType {

    BUY = "BUY",

    SELL = "SELL",

    TAKE_PROFIT = "TAKE_PROFIT",

    STOP_LOSS = "STOP_LOSS"
}

export interface TradeMarker {

    id: string;

    type: TradeMarkerType;

    time: Date;

    price: number;

    quantity: number;

    label?: string;
}

/* -------------------------------------------------------------------------- */
/*                        POSITION OVERLAY                                    */
/* -------------------------------------------------------------------------- */

export interface PositionOverlay {

    id: string;

    entryPrice: number;

    stopLoss?: number;

    takeProfit?: number;

    currentPrice: number;

    quantity: number;

    unrealizedPnL: number;

    profitPercentage: number;
}

/* -------------------------------------------------------------------------- */
/*                        RISK / REWARD TOOL                                  */
/* -------------------------------------------------------------------------- */

export interface RiskRewardTool {

    entry: number;

    stopLoss: number;

    takeProfit: number;

    risk: number;

    reward: number;

    ratio: number;
}

/* -------------------------------------------------------------------------- */
/*                         MEASUREMENT TOOL                                   */
/* -------------------------------------------------------------------------- */

export interface Measurement {

    start: ChartPoint;

    end: ChartPoint;

    priceDifference: number;

    percentageDifference: number;

    candleCount: number;

    durationMilliseconds: number;
}

/* -------------------------------------------------------------------------- */
/*                        MAGNET MODE                                         */
/* -------------------------------------------------------------------------- */

export interface MagnetMode {

    enabled: boolean;

    strength: number;
}

/* -------------------------------------------------------------------------- */
/*                       OBJECT SELECTION                                     */
/* -------------------------------------------------------------------------- */

export interface SelectionState {

    selectedObjectIds: string[];

    multiSelect: boolean;

    editable: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         CHART OVERLAY                                      */
/* -------------------------------------------------------------------------- */

export interface ChartOverlay {

    drawings: DrawingObject[];

    tradeMarkers: TradeMarker[];

    priceMarkers: PriceMarker[];

    visible: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       DRAWING HISTORY                                      */
/* -------------------------------------------------------------------------- */

export interface DrawingHistory {

    undoStack: DrawingObject[];

    redoStack: DrawingObject[];
}
/* -------------------------------------------------------------------------- */
/*                            CHART PANES                                     */
/* -------------------------------------------------------------------------- */

export interface ChartPane {

    id: string;

    title: string;

    height: number;

    visible: boolean;

    resizable: boolean;

    indicators: string[];
}

/* -------------------------------------------------------------------------- */
/*                         CHART LAYOUT                                       */
/* -------------------------------------------------------------------------- */

export enum ChartLayoutType {

    SINGLE = "SINGLE",

    VERTICAL_SPLIT = "VERTICAL_SPLIT",

    HORIZONTAL_SPLIT = "HORIZONTAL_SPLIT",

    GRID_2 = "GRID_2",

    GRID_4 = "GRID_4",

    GRID_6 = "GRID_6",

    GRID_8 = "GRID_8"
}

export interface ChartLayout {

    id: string;

    type: ChartLayoutType;

    charts: TradingChart[];

    synchronized: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       INDICATOR INSTANCE                                   */
/* -------------------------------------------------------------------------- */

export interface IndicatorInstance {

    id: string;

    name: string;

    paneId: string;

    enabled: boolean;

    visible: boolean;

    parameters: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                         CHART TEMPLATE                                     */
/* -------------------------------------------------------------------------- */

export interface ChartTemplate {

    id: string;

    name: string;

    configuration: ChartConfiguration;

    indicators: IndicatorInstance[];

    overlays: ChartOverlay;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                          CHART WORKSPACE                                   */
/* -------------------------------------------------------------------------- */

export interface ChartWorkspace {

    id: string;

    name: string;

    layouts: ChartLayout[];

    activeLayoutId: string;

    createdAt: Date;

    updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                           REPLAY MODE                                      */
/* -------------------------------------------------------------------------- */

export enum ReplayState {

    STOPPED = "STOPPED",

    PLAYING = "PLAYING",

    PAUSED = "PAUSED",

    COMPLETED = "COMPLETED"
}

export interface ChartReplay {

    enabled: boolean;

    state: ReplayState;

    speed: number;

    currentIndex: number;

    startedAt?: Date;
}

/* -------------------------------------------------------------------------- */
/*                       SYNCHRONIZATION                                      */
/* -------------------------------------------------------------------------- */

export interface ChartSynchronization {

    synchronizeTimeframe: boolean;

    synchronizeCrosshair: boolean;

    synchronizeZoom: boolean;

    synchronizeScroll: boolean;

    synchronizeDrawings: boolean;
}

/* -------------------------------------------------------------------------- */
/*                          CHART ZOOM                                        */
/* -------------------------------------------------------------------------- */

export interface ChartZoom {

    level: number;

    minimum: number;

    maximum: number;

    smoothZoom: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           CHART SCROLL                                     */
/* -------------------------------------------------------------------------- */

export interface ChartScroll {

    offset: number;

    autoScroll: boolean;

    lockToLatest: boolean;
}

/* -------------------------------------------------------------------------- */
/*                      KEYBOARD SHORTCUT                                     */
/* -------------------------------------------------------------------------- */

export interface KeyboardShortcut {

    id: string;

    action: string;

    key: string;

    ctrl: boolean;

    shift: boolean;

    alt: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           EXPORT SETTINGS                                  */
/* -------------------------------------------------------------------------- */

export interface ChartExportOptions {

    includeIndicators: boolean;

    includeDrawings: boolean;

    includeTrades: boolean;

    includeWatermark: boolean;

    format: "PNG" | "SVG" | "PDF";
}

/* -------------------------------------------------------------------------- */
/*                          IMPORT SETTINGS                                   */
/* -------------------------------------------------------------------------- */

export interface ChartImportOptions {

    replaceExisting: boolean;

    importIndicators: boolean;

    importDrawings: boolean;

    importTemplates: boolean;
}

/* -------------------------------------------------------------------------- */
/*                           AUTO SAVE                                        */
/* -------------------------------------------------------------------------- */

export interface AutoSaveConfiguration {

    enabled: boolean;

    intervalSeconds: number;

    saveWorkspace: boolean;

    saveTemplates: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         CHART PERFORMANCE                                  */
/* -------------------------------------------------------------------------- */

export interface ChartPerformance {

    fps: number;

    renderTime: number;

    memoryUsage: number;

    visibleCandles: number;

    totalObjects: number;
}

/* -------------------------------------------------------------------------- */
/*                         CHART SESSION                                      */
/* -------------------------------------------------------------------------- */

export interface ChartSession {

    id: string;

    startedAt: Date;

    lastInteraction: Date;

    activeTool?: DrawingToolType;

    workspaceId: string;
}

/* -------------------------------------------------------------------------- */
/*                       CHART EVENT                                          */
/* -------------------------------------------------------------------------- */

export enum ChartEventType {

    ZOOM = "ZOOM",

    PAN = "PAN",

    DRAW = "DRAW",

    DELETE = "DELETE",

    SELECT = "SELECT",

    SAVE = "SAVE",

    LOAD = "LOAD",

    EXPORT = "EXPORT"
}

export interface ChartEvent {

    id: string;

    type: ChartEventType;

    timestamp: Date;

    payload?: Record<string, unknown>;
}

/* -------------------------------------------------------------------------- */
/*                         DEFAULT CONFIGURATION                              */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CHART_TYPE = ChartType.CANDLESTICK;

export const DEFAULT_CHART_SCALE = ChartScale.LINEAR;

export const DEFAULT_CROSSHAIR_MODE = CrosshairMode.BOTH;

export const DEFAULT_GRID_STYLE = GridStyle.DOTTED;

export const DEFAULT_PRICE_AXIS = PriceAxisPosition.RIGHT;

export const DEFAULT_REPLAY_STATE = ReplayState.STOPPED;

/* -------------------------------------------------------------------------- */
/*                        DEFAULT DIMENSIONS                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CHART_DIMENSIONS: ChartDimensions = {

    width: 1280,

    height: 720,

    responsive: true
};

/* -------------------------------------------------------------------------- */
/*                         DEFAULT GRID                                       */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CHART_GRID: ChartGrid = {

    visible: true,

    style: DEFAULT_GRID_STYLE,

    horizontalLines: true,

    verticalLines: true
};

/* -------------------------------------------------------------------------- */
/*                        DEFAULT CROSSHAIR                                   */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CROSSHAIR: Crosshair = {

    enabled: true,

    mode: DEFAULT_CROSSHAIR_MODE,

    showPriceLabel: true,

    showTimeLabel: true
};

/* -------------------------------------------------------------------------- */
/*                         DEFAULT PRICE SCALE                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_PRICE_SCALE: PriceScale = {

    autoScale: true,

    scale: DEFAULT_CHART_SCALE,

    position: DEFAULT_PRICE_AXIS
};

/* -------------------------------------------------------------------------- */
/*                         DEFAULT TIME SCALE                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_TIME_SCALE: TimeScale = {

    visibleBars: 150,

    rightOffset: 10,

    lockVisibleRange: false,

    showSeconds: false
};

/* -------------------------------------------------------------------------- */
/*                      DEFAULT CHART CONFIG                                  */
/* -------------------------------------------------------------------------- */

export const DEFAULT_CHART_CONFIGURATION: ChartConfiguration = {

    type: DEFAULT_CHART_TYPE,

    timeframe: Timeframe.M1,

    theme: Theme.DARK,

    dimensions: DEFAULT_CHART_DIMENSIONS,

    grid: DEFAULT_CHART_GRID,

    crosshair: DEFAULT_CROSSHAIR,

    priceScale: DEFAULT_PRICE_SCALE,

    timeScale: DEFAULT_TIME_SCALE,

    animation: true
};

/* -------------------------------------------------------------------------- */
/*                         COLLECTION TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface ChartCollection {

    items: TradingChart[];

    total: number;
}

export interface DrawingCollection {

    items: DrawingObject[];

    total: number;
}

export interface TemplateCollection {

    items: ChartTemplate[];

    total: number;
}

export interface WorkspaceCollection {

    items: ChartWorkspace[];

    total: number;
}

/* -------------------------------------------------------------------------- */
/*                         LOOKUP MAPS                                        */
/* -------------------------------------------------------------------------- */

export type ChartMap = Record<string, TradingChart>;

export type DrawingMap = Record<string, DrawingObject>;

export type TemplateMap = Record<string, ChartTemplate>;

export type WorkspaceMap = Record<string, ChartWorkspace>;

export type MarkerMap = Record<string, TradeMarker>;

/* -------------------------------------------------------------------------- */
/*                        CALLBACK TYPES                                      */
/* -------------------------------------------------------------------------- */

export type ChartUpdateHandler = (

    chart: TradingChart

) => void;

export type ChartClickHandler = (

    point: ChartPoint

) => void;

export type ChartMoveHandler = (

    point: ChartPoint

) => void;

export type DrawingCreatedHandler = (

    drawing: DrawingObject

) => void;

export type DrawingUpdatedHandler = (

    drawing: DrawingObject

) => void;

export type DrawingDeletedHandler = (

    drawingId: string

) => void;

export type ReplayStateHandler = (

    replay: ChartReplay

) => void;

export type WorkspaceHandler = (

    workspace: ChartWorkspace

) => void;

/* -------------------------------------------------------------------------- */
/*                          READONLY TYPES                                    */
/* -------------------------------------------------------------------------- */

export type ReadonlyChart =
    Readonly<TradingChart>;

export type ReadonlyConfiguration =
    Readonly<ChartConfiguration>;

export type ReadonlyDrawing =
    Readonly<DrawingObject>;

export type ReadonlyMarker =
    Readonly<TradeMarker>;

export type ReadonlyTemplate =
    Readonly<ChartTemplate>;

export type ReadonlyWorkspace =
    Readonly<ChartWorkspace>;

export type ReadonlyViewport =
    Readonly<ChartViewport>;

export type ReadonlyReplay =
    Readonly<ChartReplay>;

/* -------------------------------------------------------------------------- */
/*                         FACTORY MODELS                                     */
/* -------------------------------------------------------------------------- */

export interface CreateChartOptions {

    instrumentId: string;

    timeframe: Timeframe;

    chartType: ChartType;

    theme: Theme;
}

export interface DuplicateChartOptions {

    chartId: string;

    includeIndicators: boolean;

    includeDrawings: boolean;

    includeTemplates: boolean;
}

/* -------------------------------------------------------------------------- */
/*                        CHART VERSION                                       */
/* -------------------------------------------------------------------------- */

export interface ChartVersion {

    version: string;

    build: string;

    renderer: string;

    generatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                       RENDER STATISTICS                                    */
/* -------------------------------------------------------------------------- */

export interface RenderStatistics {

    renderCount: number;

    averageFrameTime: number;

    droppedFrames: number;

    lastRenderTime: Date;
}

/* -------------------------------------------------------------------------- */
/*                      CHART UTILITIES                                       */
/* -------------------------------------------------------------------------- */

export interface ChartBounds {

    minPrice: number;

    maxPrice: number;

    firstTimestamp: Date;

    lastTimestamp: Date;
}

export interface VisibleRange {

    firstVisibleIndex: number;

    lastVisibleIndex: number;

    visibleCandles: number;
}

export interface MousePosition {

    x: number;

    y: number;

    price?: number;

    time?: Date;
}

/* -------------------------------------------------------------------------- */
/*                           END OF FILE                                      */
/* -------------------------------------------------------------------------- */