/**
 * ============================================================================
 * APPLICATION LAYOUT (FIXED + CONSOLIDATED)
 * ============================================================================
 */

import {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export interface AppLayoutProps {
    readonly children: ReactNode;
}

interface AppLayoutStatus {
    readonly loading: boolean;
    readonly online: boolean;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_SIDEBAR_WIDTH = 280;

export default function AppLayout({ children }: AppLayoutProps) {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
    const [loading] = useState(false);
    const [online, setOnline] = useState<boolean>(
        typeof navigator !== "undefined" ? navigator.onLine : true
    );

    /* ---------------- TOGGLE SIDEBAR ---------------- */

    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    /* ---------------- ONLINE/OFFLINE LISTENERS ---------------- */

    useEffect(() => {

        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };

    }, []);

    /* ---------------- KEYBOARD SHORTCUTS ---------------- */

    useEffect(() => {

        const handleKeyboard = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "b") {
                event.preventDefault();
                toggleSidebar();
            }
        };

        window.addEventListener("keydown", handleKeyboard);

        return () => {
            window.removeEventListener("keydown", handleKeyboard);
        };

    }, [toggleSidebar]);

    /* ---------------- COMPUTED STATE ---------------- */

    const layoutClassName = useMemo(() => (
        sidebarOpen
            ? "app-layout sidebar-open"
            : "app-layout sidebar-closed"
    ), [sidebarOpen]);

    const metadata = useMemo<AppLayoutStatus>(() => ({
        loading,
        online
    }), [loading, online]);

    /* ---------------- RENDER ---------------- */

    return (
        <div className={layoutClassName} data-sidebar={sidebarOpen}>

            {/* Loading Overlay */}
            {metadata.loading && (
                <div className="app-loading-overlay">
                    Loading...
                </div>
            )}

            {/* Header */}
            <header className="app-header" role="banner">

                <button
                    type="button"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                    aria-expanded={sidebarOpen}
                >
                    ☰
                </button>

                <span>BET Platform</span>

                <div className="app-status" aria-live="polite">
                    {metadata.online ? "🟢 Online" : "🔴 Offline"}
                </div>

            </header>

            {/* Body */}
            <div className="app-body">

                {sidebarOpen && (
                    <aside
                        className="app-sidebar"
                        role="navigation"
                        style={{ width: sidebarWidth }}
                    >
                        Sidebar
                    </aside>
                )}

                <main className="app-content" role="main">
                    {children}
                </main>

            </div>

            {/* Portals */}
            <div id="notification-root" />
            <div id="modal-root" />
            <div id="toast-root" />

            {/* Footer */}
            <footer className="app-footer" role="contentinfo">
                © 2026 BET Platform
            </footer>

        </div>
    );
}