/**
 * ============================================================================
 * COMMON ENUMS
 * ============================================================================
 * Shared enumerations used across the application.
 *
 * IMPORTANT:
 * This file contains ONLY enums shared by multiple domains.
 * Domain-specific enums remain inside their own files.
 *
 * Used by:
 * - Wallet
 * - Trade
 * - Market
 * - User
 * - Analytics
 * - Notifications
 * - Admin
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                               ENVIRONMENT                                  */
/* -------------------------------------------------------------------------- */

export enum Environment {
    DEVELOPMENT = "development",
    STAGING = "staging",
    TESTING = "testing",
    PRODUCTION = "production"
}

/* -------------------------------------------------------------------------- */
/*                               APPLICATION                                  */
/* -------------------------------------------------------------------------- */

export enum ApplicationMode {
    DEMO = "DEMO",
    REAL = "REAL",
    MAINTENANCE = "MAINTENANCE"
}

/* -------------------------------------------------------------------------- */
/*                                  THEME                                     */
/* -------------------------------------------------------------------------- */

export enum ThemeMode {
    LIGHT = "LIGHT",
    DARK = "DARK",
    SYSTEM = "SYSTEM"
}

export enum ColorScheme {
    BLUE = "BLUE",
    GREEN = "GREEN",
    PURPLE = "PURPLE",
    ORANGE = "ORANGE",
    RED = "RED"
}

/* -------------------------------------------------------------------------- */
/*                                LANGUAGE                                    */
/* -------------------------------------------------------------------------- */

export enum Language {
    ENGLISH = "en",
    FRENCH = "fr",
    SPANISH = "es",
    PORTUGUESE = "pt",
    ARABIC = "ar",
    SWAHILI = "sw",
    GERMAN = "de",
    CHINESE = "zh"
}

/* -------------------------------------------------------------------------- */
/*                                TIMEZONE                                    */
/* -------------------------------------------------------------------------- */

export enum TimeZone {
    UTC = "UTC",
    AFRICA_NAIROBI = "Africa/Nairobi",
    EUROPE_LONDON = "Europe/London",
    AMERICA_NEW_YORK = "America/New_York",
    ASIA_DUBAI = "Asia/Dubai"
}

/* -------------------------------------------------------------------------- */
/*                               CURRENCIES                                   */
/* -------------------------------------------------------------------------- */

export enum CurrencyCode {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    KES = "KES",
    NGN = "NGN",
    UGX = "UGX",
    TZS = "TZS",
    ZAR = "ZAR",
    GHS = "GHS",
    INR = "INR",
    CNY = "CNY",
    JPY = "JPY",
    AUD = "AUD",
    CAD = "CAD",
    CHF = "CHF",
    BTC = "BTC",
    ETH = "ETH",
    USDT = "USDT"
}

/* -------------------------------------------------------------------------- */
/*                              COUNTRIES                                     */
/* -------------------------------------------------------------------------- */

export enum CountryCode {
    KENYA = "KE",
    UGANDA = "UG",
    TANZANIA = "TZ",
    RWANDA = "RW",
    ETHIOPIA = "ET",
    NIGERIA = "NG",
    GHANA = "GH",
    SOUTH_AFRICA = "ZA",
    UNITED_KINGDOM = "GB",
    UNITED_STATES = "US",
    INDIA = "IN",
    CHINA = "CN",
    UAE = "AE"
}

/* -------------------------------------------------------------------------- */
/*                             DATE FORMAT                                    */
/* -------------------------------------------------------------------------- */

export enum DateFormat {
    DD_MM_YYYY = "DD/MM/YYYY",
    MM_DD_YYYY = "MM/DD/YYYY",
    YYYY_MM_DD = "YYYY-MM-DD"
}

/* -------------------------------------------------------------------------- */
/*                             TIME FORMAT                                    */
/* -------------------------------------------------------------------------- */

export enum TimeFormat {
    TWELVE_HOUR = "12H",
    TWENTY_FOUR_HOUR = "24H"
}

/* -------------------------------------------------------------------------- */
/*                               TIMEFRAMES                                   */
/* -------------------------------------------------------------------------- */

export enum Timeframe {

    TICK = "1T",

    S1 = "1S",

    S5 = "5S",

    S15 = "15S",

    M1 = "1M",

    M2 = "2M",

    M5 = "5M",

    M10 = "10M",

    M15 = "15M",

    M30 = "30M",

    H1 = "1H",

    H4 = "4H",

    D1 = "1D",

    W1 = "1W",

    MN1 = "1MO"
}

/* -------------------------------------------------------------------------- */
/*                             SORT DIRECTION                                 */
/* -------------------------------------------------------------------------- */

export enum SortDirection {

    ASC = "ASC",

    DESC = "DESC"
}

/* -------------------------------------------------------------------------- */
/*                             ORDER DIRECTION                                */
/* -------------------------------------------------------------------------- */

export enum Direction {

    UP = "UP",

    DOWN = "DOWN",

    BUY = "BUY",

    SELL = "SELL"
}

/* -------------------------------------------------------------------------- */
/*                              STATUS                                        */
/* -------------------------------------------------------------------------- */

export enum Status {

    ACTIVE = "ACTIVE",

    INACTIVE = "INACTIVE",

    PENDING = "PENDING",

    SUSPENDED = "SUSPENDED",

    DISABLED = "DISABLED",

    ARCHIVED = "ARCHIVED",

    DELETED = "DELETED"
}

/* -------------------------------------------------------------------------- */
/*                             PRIORITY                                       */
/* -------------------------------------------------------------------------- */

export enum Priority {

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    CRITICAL = "CRITICAL"
}

/* -------------------------------------------------------------------------- */
/*                            RISK LEVEL                                      */
/* -------------------------------------------------------------------------- */

export enum RiskLevel {

    VERY_LOW = "VERY_LOW",

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    VERY_HIGH = "VERY_HIGH",

    EXTREME = "EXTREME"
}

/* -------------------------------------------------------------------------- */
/*                          DATA SOURCE                                       */
/* -------------------------------------------------------------------------- */

export enum DataSource {

    API = "API",

    CACHE = "CACHE",

    WEBSOCKET = "WEBSOCKET",

    DATABASE = "DATABASE",

    MOCK = "MOCK"
}

/* -------------------------------------------------------------------------- */
/*                               USER ROLES                                   */
/* -------------------------------------------------------------------------- */

export enum UserRole {

    SUPER_ADMIN = "SUPER_ADMIN",

    ADMIN = "ADMIN",

    SUPPORT = "SUPPORT",

    MANAGER = "MANAGER",

    MODERATOR = "MODERATOR",

    AFFILIATE_MANAGER = "AFFILIATE_MANAGER",

    ANALYST = "ANALYST",

    TRADER = "TRADER",

    USER = "USER",

    GUEST = "GUEST"
}

/* -------------------------------------------------------------------------- */
/*                              PERMISSIONS                                   */
/* -------------------------------------------------------------------------- */

export enum Permission {

    /* User Management */
    VIEW_USERS = "VIEW_USERS",
    CREATE_USER = "CREATE_USER",
    UPDATE_USER = "UPDATE_USER",
    DELETE_USER = "DELETE_USER",

    /* Wallet */
    VIEW_WALLETS = "VIEW_WALLETS",
    CREDIT_WALLET = "CREDIT_WALLET",
    DEBIT_WALLET = "DEBIT_WALLET",
    FREEZE_WALLET = "FREEZE_WALLET",

    /* Trading */
    PLACE_TRADE = "PLACE_TRADE",
    CANCEL_TRADE = "CANCEL_TRADE",
    VIEW_TRADES = "VIEW_TRADES",
    MODIFY_TRADE = "MODIFY_TRADE",

    /* Markets */
    VIEW_MARKETS = "VIEW_MARKETS",
    MANAGE_MARKETS = "MANAGE_MARKETS",

    /* Analytics */
    VIEW_ANALYTICS = "VIEW_ANALYTICS",
    EXPORT_ANALYTICS = "EXPORT_ANALYTICS",

    /* Notifications */
    SEND_NOTIFICATION = "SEND_NOTIFICATION",

    /* Admin */
    ACCESS_ADMIN_PANEL = "ACCESS_ADMIN_PANEL",
    MANAGE_SETTINGS = "MANAGE_SETTINGS",
    VIEW_AUDIT_LOGS = "VIEW_AUDIT_LOGS",

    /* AI */
    USE_AI_ASSISTANT = "USE_AI_ASSISTANT",
    MANAGE_AI_SETTINGS = "MANAGE_AI_SETTINGS"
}

/* -------------------------------------------------------------------------- */
/*                        AUTHENTICATION PROVIDERS                            */
/* -------------------------------------------------------------------------- */

export enum AuthProvider {

    EMAIL = "EMAIL",

    GOOGLE = "GOOGLE",

    MICROSOFT = "MICROSOFT",

    GITHUB = "GITHUB",

    APPLE = "APPLE",

    LINKEDIN = "LINKEDIN"
}

/* -------------------------------------------------------------------------- */
/*                         MULTI FACTOR AUTHENTICATION                        */
/* -------------------------------------------------------------------------- */

export enum TwoFactorMethod {

    NONE = "NONE",

    SMS = "SMS",

    EMAIL = "EMAIL",

    AUTHENTICATOR = "AUTHENTICATOR",

    SECURITY_KEY = "SECURITY_KEY"
}

/* -------------------------------------------------------------------------- */
/*                           ACCOUNT STATUS                                   */
/* -------------------------------------------------------------------------- */

export enum AccountStatus {

    PENDING = "PENDING",

    ACTIVE = "ACTIVE",

    VERIFIED = "VERIFIED",

    LIMITED = "LIMITED",

    LOCKED = "LOCKED",

    SUSPENDED = "SUSPENDED",

    CLOSED = "CLOSED"
}

/* -------------------------------------------------------------------------- */
/*                           VERIFICATION STATUS                              */
/* -------------------------------------------------------------------------- */

export enum VerificationStatus {

    NOT_STARTED = "NOT_STARTED",

    PENDING = "PENDING",

    UNDER_REVIEW = "UNDER_REVIEW",

    VERIFIED = "VERIFIED",

    REJECTED = "REJECTED",

    EXPIRED = "EXPIRED"
}

/* -------------------------------------------------------------------------- */
/*                               KYC LEVEL                                    */
/* -------------------------------------------------------------------------- */

export enum KYCLevel {

    NONE = "NONE",

    BASIC = "BASIC",

    STANDARD = "STANDARD",

    ADVANCED = "ADVANCED",

    FULL = "FULL"
}

/* -------------------------------------------------------------------------- */
/*                              LOGIN METHOD                                  */
/* -------------------------------------------------------------------------- */

export enum LoginMethod {

    PASSWORD = "PASSWORD",

    GOOGLE = "GOOGLE",

    MICROSOFT = "MICROSOFT",

    GITHUB = "GITHUB",

    APPLE = "APPLE",

    MAGIC_LINK = "MAGIC_LINK"
}

/* -------------------------------------------------------------------------- */
/*                             SESSION STATUS                                 */
/* -------------------------------------------------------------------------- */

export enum SessionStatus {

    ACTIVE = "ACTIVE",

    EXPIRED = "EXPIRED",

    REVOKED = "REVOKED",

    TERMINATED = "TERMINATED"
}

/* -------------------------------------------------------------------------- */
/*                               DEVICE TYPE                                  */
/* -------------------------------------------------------------------------- */

export enum DeviceType {

    DESKTOP = "DESKTOP",

    LAPTOP = "LAPTOP",

    MOBILE = "MOBILE",

    TABLET = "TABLET",

    SMART_TV = "SMART_TV",

    UNKNOWN = "UNKNOWN"
}

/* -------------------------------------------------------------------------- */
/*                            OPERATING SYSTEM                                */
/* -------------------------------------------------------------------------- */

export enum OperatingSystem {

    WINDOWS = "WINDOWS",

    MACOS = "MACOS",

    LINUX = "LINUX",

    ANDROID = "ANDROID",

    IOS = "IOS",

    UNKNOWN = "UNKNOWN"
}

/* -------------------------------------------------------------------------- */
/*                                BROWSER                                     */
/* -------------------------------------------------------------------------- */

export enum Browser {

    CHROME = "CHROME",

    EDGE = "EDGE",

    FIREFOX = "FIREFOX",

    SAFARI = "SAFARI",

    OPERA = "OPERA",

    BRAVE = "BRAVE",

    UNKNOWN = "UNKNOWN"
}

/* -------------------------------------------------------------------------- */
/*                            CONNECTION TYPE                                 */
/* -------------------------------------------------------------------------- */

export enum ConnectionType {

    WIFI = "WIFI",

    MOBILE_DATA = "MOBILE_DATA",

    ETHERNET = "ETHERNET",

    VPN = "VPN",

    UNKNOWN = "UNKNOWN"
}

/* -------------------------------------------------------------------------- */
/*                           SECURITY LEVEL                                   */
/* -------------------------------------------------------------------------- */

export enum SecurityLevel {

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    VERY_HIGH = "VERY_HIGH",

    MAXIMUM = "MAXIMUM"
}

/* -------------------------------------------------------------------------- */
/*                            USER PRESENCE                                   */
/* -------------------------------------------------------------------------- */

export enum PresenceStatus {

    ONLINE = "ONLINE",

    OFFLINE = "OFFLINE",

    AWAY = "AWAY",

    BUSY = "BUSY",

    INVISIBLE = "INVISIBLE"
}

/* -------------------------------------------------------------------------- */
/*                             ACTIVITY TYPE                                  */
/* -------------------------------------------------------------------------- */

export enum ActivityType {

    LOGIN = "LOGIN",

    LOGOUT = "LOGOUT",

    PASSWORD_CHANGE = "PASSWORD_CHANGE",

    PROFILE_UPDATE = "PROFILE_UPDATE",

    DEPOSIT = "DEPOSIT",

    WITHDRAWAL = "WITHDRAWAL",

    TRADE = "TRADE",

    SETTINGS_UPDATE = "SETTINGS_UPDATE",

    ACCOUNT_VERIFICATION = "ACCOUNT_VERIFICATION"
}


/* -------------------------------------------------------------------------- */
/*                         NOTIFICATION CHANNELS                              */
/* -------------------------------------------------------------------------- */

export enum NotificationChannel {

    IN_APP = "IN_APP",

    EMAIL = "EMAIL",

    SMS = "SMS",

    PUSH = "PUSH",

    WHATSAPP = "WHATSAPP",

    TELEGRAM = "TELEGRAM",

    SLACK = "SLACK",

    WEBHOOK = "WEBHOOK"
}

/* -------------------------------------------------------------------------- */
/*                          NOTIFICATION TYPE                                 */
/* -------------------------------------------------------------------------- */

export enum NotificationType {

    SYSTEM = "SYSTEM",

    TRADE = "TRADE",

    MARKET = "MARKET",

    WALLET = "WALLET",

    SECURITY = "SECURITY",

    PROMOTION = "PROMOTION",

    NEWS = "NEWS",

    ANNOUNCEMENT = "ANNOUNCEMENT",

    REFERRAL = "REFERRAL",

    AFFILIATE = "AFFILIATE",

    ADMIN = "ADMIN"
}

/* -------------------------------------------------------------------------- */
/*                           NOTIFICATION STATUS                              */
/* -------------------------------------------------------------------------- */

export enum NotificationStatus {

    UNREAD = "UNREAD",

    READ = "READ",

    SENT = "SENT",

    FAILED = "FAILED",

    ARCHIVED = "ARCHIVED"
}

/* -------------------------------------------------------------------------- */
/*                              LOG LEVEL                                     */
/* -------------------------------------------------------------------------- */

export enum LogLevel {

    TRACE = "TRACE",

    DEBUG = "DEBUG",

    INFO = "INFO",

    WARN = "WARN",

    ERROR = "ERROR",

    FATAL = "FATAL"
}

/* -------------------------------------------------------------------------- */
/*                            LOG SOURCE                                      */
/* -------------------------------------------------------------------------- */

export enum LogSource {

    CLIENT = "CLIENT",

    SERVER = "SERVER",

    DATABASE = "DATABASE",

    API = "API",

    WEBSOCKET = "WEBSOCKET",

    AUTHENTICATION = "AUTHENTICATION",

    PAYMENT = "PAYMENT",

    AI_ENGINE = "AI_ENGINE"
}

/* -------------------------------------------------------------------------- */
/*                          ANALYTICS PERIOD                                  */
/* -------------------------------------------------------------------------- */

export enum AnalyticsPeriod {

    TODAY = "TODAY",

    YESTERDAY = "YESTERDAY",

    LAST_7_DAYS = "LAST_7_DAYS",

    LAST_30_DAYS = "LAST_30_DAYS",

    THIS_MONTH = "THIS_MONTH",

    LAST_MONTH = "LAST_MONTH",

    THIS_YEAR = "THIS_YEAR",

    CUSTOM = "CUSTOM"
}

/* -------------------------------------------------------------------------- */
/*                            ANALYTICS METRIC                                */
/* -------------------------------------------------------------------------- */

export enum AnalyticsMetric {

    PROFIT = "PROFIT",

    LOSS = "LOSS",

    ROI = "ROI",

    WIN_RATE = "WIN_RATE",

    LOSS_RATE = "LOSS_RATE",

    VOLUME = "VOLUME",

    DEPOSITS = "DEPOSITS",

    WITHDRAWALS = "WITHDRAWALS",

    ACTIVE_USERS = "ACTIVE_USERS",

    NEW_USERS = "NEW_USERS"
}

/* -------------------------------------------------------------------------- */
/*                               AI MODELS                                    */
/* -------------------------------------------------------------------------- */

export enum AIModel {

    PRICE_PREDICTION = "PRICE_PREDICTION",

    TREND_ANALYSIS = "TREND_ANALYSIS",

    MARKET_SENTIMENT = "MARKET_SENTIMENT",

    RISK_ANALYSIS = "RISK_ANALYSIS",

    TRADE_RECOMMENDATION = "TRADE_RECOMMENDATION",

    FRAUD_DETECTION = "FRAUD_DETECTION"
}

/* -------------------------------------------------------------------------- */
/*                            AI CONFIDENCE                                   */
/* -------------------------------------------------------------------------- */

export enum AIConfidence {

    VERY_LOW = "VERY_LOW",

    LOW = "LOW",

    MEDIUM = "MEDIUM",

    HIGH = "HIGH",

    VERY_HIGH = "VERY_HIGH"
}

/* -------------------------------------------------------------------------- */
/*                             EXPORT FORMAT                                  */
/* -------------------------------------------------------------------------- */

export enum ExportFormat {

    CSV = "CSV",

    XLSX = "XLSX",

    PDF = "PDF",

    JSON = "JSON"
}

/* -------------------------------------------------------------------------- */
/*                              IMPORT FORMAT                                 */
/* -------------------------------------------------------------------------- */

export enum ImportFormat {

    CSV = "CSV",

    XLSX = "XLSX",

    JSON = "JSON"
}

/* -------------------------------------------------------------------------- */
/*                            CHART TYPE                                      */
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

/* -------------------------------------------------------------------------- */
/*                         CHART INDICATOR                                    */
/* -------------------------------------------------------------------------- */

export enum IndicatorType {

    SMA = "SMA",

    EMA = "EMA",

    RSI = "RSI",

    MACD = "MACD",

    ATR = "ATR",

    ADX = "ADX",

    VWAP = "VWAP",

    BOLLINGER_BANDS = "BOLLINGER_BANDS",

    ICHIMOKU = "ICHIMOKU",

    STOCHASTIC = "STOCHASTIC",

    PARABOLIC_SAR = "PARABOLIC_SAR",

    CCI = "CCI",

    MOMENTUM = "MOMENTUM",

    ROC = "ROC",

    OBV = "OBV"
}

/* -------------------------------------------------------------------------- */
/*                         MARKET VOLATILITY                                  */
/* -------------------------------------------------------------------------- */

export enum VolatilityLevel {

    VERY_LOW = "VERY_LOW",

    LOW = "LOW",

    NORMAL = "NORMAL",

    HIGH = "HIGH",

    EXTREME = "EXTREME"
}

/* -------------------------------------------------------------------------- */
/*                           MARKET TREND                                     */
/* -------------------------------------------------------------------------- */

export enum MarketTrend {

    STRONG_BULLISH = "STRONG_BULLISH",

    BULLISH = "BULLISH",

    SIDEWAYS = "SIDEWAYS",

    BEARISH = "BEARISH",

    STRONG_BEARISH = "STRONG_BEARISH"
}

/* -------------------------------------------------------------------------- */
/*                         WEBSOCKET STATUS                                   */
/* -------------------------------------------------------------------------- */

export enum WebSocketStatus {

    CONNECTING = "CONNECTING",

    CONNECTED = "CONNECTED",

    DISCONNECTED = "DISCONNECTED",

    RECONNECTING = "RECONNECTING",

    FAILED = "FAILED"
}

/* -------------------------------------------------------------------------- */
/*                          CACHE STRATEGY                                    */
/* -------------------------------------------------------------------------- */

export enum CacheStrategy {

    MEMORY = "MEMORY",

    LOCAL_STORAGE = "LOCAL_STORAGE",

    SESSION_STORAGE = "SESSION_STORAGE",

    INDEXED_DB = "INDEXED_DB",

    NONE = "NONE"
}

/* -------------------------------------------------------------------------- */
/*                            CACHE STATUS                                    */
/* -------------------------------------------------------------------------- */

export enum CacheStatus {

    HIT = "HIT",

    MISS = "MISS",

    REFRESHED = "REFRESHED",

    EXPIRED = "EXPIRED"
}

/* -------------------------------------------------------------------------- */
/*                             FILTER OPERATORS                               */
/* -------------------------------------------------------------------------- */

export enum FilterOperator {

    EQUALS = "EQUALS",

    NOT_EQUALS = "NOT_EQUALS",

    GREATER_THAN = "GREATER_THAN",

    GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",

    LESS_THAN = "LESS_THAN",

    LESS_THAN_OR_EQUAL = "LESS_THAN_OR_EQUAL",

    CONTAINS = "CONTAINS",

    STARTS_WITH = "STARTS_WITH",

    ENDS_WITH = "ENDS_WITH",

    BETWEEN = "BETWEEN",

    IN = "IN",

    NOT_IN = "NOT_IN",

    IS_NULL = "IS_NULL",

    IS_NOT_NULL = "IS_NOT_NULL"
}

/* -------------------------------------------------------------------------- */
/*                             FILE TYPES                                     */
/* -------------------------------------------------------------------------- */

export enum FileType {

    IMAGE = "IMAGE",

    VIDEO = "VIDEO",

    AUDIO = "AUDIO",

    DOCUMENT = "DOCUMENT",

    PDF = "PDF",

    CSV = "CSV",

    JSON = "JSON",

    ZIP = "ZIP",

    ARCHIVE = "ARCHIVE",

    UNKNOWN = "UNKNOWN"
}

/* -------------------------------------------------------------------------- */
/*                           IMAGE FORMAT                                     */
/* -------------------------------------------------------------------------- */

export enum ImageFormat {

    PNG = "PNG",

    JPG = "JPG",

    JPEG = "JPEG",

    GIF = "GIF",

    WEBP = "WEBP",

    SVG = "SVG"
}

/* -------------------------------------------------------------------------- */
/*                           DASHBOARD LAYOUT                                 */
/* -------------------------------------------------------------------------- */

export enum DashboardLayout {

    DEFAULT = "DEFAULT",

    COMPACT = "COMPACT",

    COMFORTABLE = "COMFORTABLE",

    FULLSCREEN = "FULLSCREEN"
}

/* -------------------------------------------------------------------------- */
/*                            SIDEBAR STATE                                   */
/* -------------------------------------------------------------------------- */

export enum SidebarState {

    EXPANDED = "EXPANDED",

    COLLAPSED = "COLLAPSED",

    HIDDEN = "HIDDEN"
}

/* -------------------------------------------------------------------------- */
/*                           WIDGET TYPES                                     */
/* -------------------------------------------------------------------------- */

export enum WidgetType {

    PRICE_CHART = "PRICE_CHART",

    WATCHLIST = "WATCHLIST",

    MARKET_OVERVIEW = "MARKET_OVERVIEW",

    TRADE_HISTORY = "TRADE_HISTORY",

    OPEN_POSITIONS = "OPEN_POSITIONS",

    PORTFOLIO = "PORTFOLIO",

    WALLET = "WALLET",

    NEWS = "NEWS",

    CALENDAR = "CALENDAR",

    HEATMAP = "HEATMAP",

    LEADERBOARD = "LEADERBOARD",

    ANALYTICS = "ANALYTICS",

    AI_ASSISTANT = "AI_ASSISTANT"
}

/* -------------------------------------------------------------------------- */
/*                             FEATURE FLAGS                                  */
/* -------------------------------------------------------------------------- */

export enum FeatureFlag {

    AI_ASSISTANT = "AI_ASSISTANT",

    COPY_TRADING = "COPY_TRADING",

    SOCIAL_TRADING = "SOCIAL_TRADING",

    TOURNAMENTS = "TOURNAMENTS",

    AFFILIATE_PROGRAM = "AFFILIATE_PROGRAM",

    LEADERBOARDS = "LEADERBOARDS",

    MARKET_NEWS = "MARKET_NEWS",

    PUSH_NOTIFICATIONS = "PUSH_NOTIFICATIONS",

    MPESA = "MPESA",

    CRYPTO_PAYMENTS = "CRYPTO_PAYMENTS",

    DEMO_ACCOUNT = "DEMO_ACCOUNT",

    DARK_MODE = "DARK_MODE"
}

/* -------------------------------------------------------------------------- */
/*                            APPLICATION MODULES                             */
/* -------------------------------------------------------------------------- */

export enum ApplicationModule {

    AUTH = "AUTH",

    USER = "USER",

    WALLET = "WALLET",

    MARKET = "MARKET",

    TRADING = "TRADING",

    ANALYTICS = "ANALYTICS",

    AI = "AI",

    NOTIFICATION = "NOTIFICATION",

    REFERRAL = "REFERRAL",

    ADMIN = "ADMIN",

    SETTINGS = "SETTINGS"
}

/* -------------------------------------------------------------------------- */
/*                              EVENT TYPES                                   */
/* -------------------------------------------------------------------------- */

export enum EventType {

    CREATED = "CREATED",

    UPDATED = "UPDATED",

    DELETED = "DELETED",

    ENABLED = "ENABLED",

    DISABLED = "DISABLED",

    LOGIN = "LOGIN",

    LOGOUT = "LOGOUT",

    CONNECTED = "CONNECTED",

    DISCONNECTED = "DISCONNECTED",

    SYNCHRONIZED = "SYNCHRONIZED"
}

/* -------------------------------------------------------------------------- */
/*                              API VERSION                                   */
/* -------------------------------------------------------------------------- */

export enum ApiVersion {

    V1 = "v1",

    V2 = "v2"
}

/* -------------------------------------------------------------------------- */
/*                           SUPPORTED CONSTANTS                              */
/* -------------------------------------------------------------------------- */

export const SUPPORTED_LANGUAGES: Language[] = [

    Language.ENGLISH,

    Language.FRENCH,

    Language.SPANISH,

    Language.PORTUGUESE,

    Language.ARABIC,

    Language.SWAHILI,

    Language.GERMAN,

    Language.CHINESE
];

export const SUPPORTED_CURRENCIES: CurrencyCode[] = [

    CurrencyCode.USD,

    CurrencyCode.EUR,

    CurrencyCode.GBP,

    CurrencyCode.KES,

    CurrencyCode.NGN,

    CurrencyCode.UGX,

    CurrencyCode.TZS,

    CurrencyCode.ZAR,

    CurrencyCode.GHS,

    CurrencyCode.INR,

    CurrencyCode.CNY,

    CurrencyCode.JPY,

    CurrencyCode.AUD,

    CurrencyCode.CAD,

    CurrencyCode.CHF,

    CurrencyCode.USDT,

    CurrencyCode.BTC,

    CurrencyCode.ETH
];

export const DEFAULT_THEME = ThemeMode.DARK;

export const DEFAULT_LANGUAGE = Language.ENGLISH;

export const DEFAULT_TIMEZONE = TimeZone.UTC;

export const DEFAULT_CURRENCY = CurrencyCode.USD;

export const DEFAULT_TIMEFRAME = Timeframe.M1;

/* -------------------------------------------------------------------------- */
/*                               END OF FILE                                  */
/* -------------------------------------------------------------------------- */
