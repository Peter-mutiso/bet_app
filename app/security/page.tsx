"use client";

import {
    Shield,
    Smartphone,
    Monitor,
    Clock,
    Lock,
    Mail,
    Bell,
    AlertTriangle,
    CheckCircle2,
    LogOut
} from "lucide-react";

import { useSecurityStore } from "@/store/useSecurityStore";

export default function SecurityPage() {

    const {

        settings,
        sessions,
        history,
        trustedDevices,

        securityScore,
        securityLevel,

        toggleTwoFactor,
        toggleLoginAlerts,
        toggleBrowserNotifications,
        toggleEmailAlerts,
        toggleSmsAlerts,
        toggleWithdrawalConfirmation,
        toggleTradingPin,
        toggleAutoLogout,

        setAutoLogoutMinutes,

        logoutSession,
        logoutAllSessions,
        removeTrustedDevice

    } = useSecurityStore();

    const levelColor = {

        LOW: "text-red-400",
        MEDIUM: "text-yellow-400",
        HIGH: "text-green-400"

    }[securityLevel];

    return (

        <div className="space-y-8 p-6">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div>

                <h1 className="text-3xl font-bold flex items-center gap-3">

                    <Shield className="text-emerald-400" />

                    Security Center

                </h1>

                <p className="mt-2 text-slate-400">

                    Protect your account and monitor every login.

                </p>

            </div>

            {/* ================================================= */}
            {/* SECURITY SCORE */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-xl font-semibold">

                            Security Score

                        </h2>

                        <p className="text-slate-400 mt-1">

                            Overall protection level

                        </p>

                    </div>

                    <div className="text-right">

                        <div className="text-4xl font-bold">

                            {securityScore}%

                        </div>

                        <div className={levelColor}>

                            {securityLevel}

                        </div>

                    </div>

                </div>

                <div className="mt-6 h-3 rounded-full bg-slate-800">

                    <div

                        className="h-3 rounded-full bg-green-500"

                        style={{

                            width: `${securityScore}%`

                        }}

                    />

                </div>

            </section>

            {/* ================================================= */}
            {/* SETTINGS */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="mb-5 text-xl font-semibold">

                    Protection

                </h2>

                <div className="space-y-5">

                    <Toggle
                        icon={<Lock size={18} />}
                        title="Two Factor Authentication"
                        value={settings.twoFactorEnabled}
                        onChange={toggleTwoFactor}
                    />

                    <Toggle
                        icon={<Bell size={18} />}
                        title="Login Alerts"
                        value={settings.loginAlerts}
                        onChange={toggleLoginAlerts}
                    />

                    <Toggle
                        icon={<Monitor size={18} />}
                        title="Browser Notifications"
                        value={settings.browserNotifications}
                        onChange={toggleBrowserNotifications}
                    />

                    <Toggle
                        icon={<Mail size={18} />}
                        title="Email Alerts"
                        value={settings.emailAlerts}
                        onChange={toggleEmailAlerts}
                    />

                    <Toggle
                        icon={<Smartphone size={18} />}
                        title="SMS Alerts"
                        value={settings.smsAlerts}
                        onChange={toggleSmsAlerts}
                    />

                    <Toggle
                        icon={<Shield size={18} />}
                        title="Withdrawal Confirmation"
                        value={settings.withdrawalConfirmation}
                        onChange={toggleWithdrawalConfirmation}
                    />

                    <Toggle
                        icon={<Lock size={18} />}
                        title="Trading PIN"
                        value={settings.tradingPinEnabled}
                        onChange={toggleTradingPin}
                    />

                    <Toggle
                        icon={<Clock size={18} />}
                        title="Auto Logout"
                        value={settings.autoLogout}
                        onChange={toggleAutoLogout}
                    />

                    <div>

                        <label className="mb-2 block text-sm text-slate-400">

                            Auto Logout Time

                        </label>

                        <input

                            type="range"

                            min={5}

                            max={120}

                            step={5}

                            value={settings.autoLogoutMinutes}

                            onChange={(e)=>

                                setAutoLogoutMinutes(

                                    Number(e.target.value)

                                )

                            }

                            className="w-full"

                        />

                        <p className="mt-2 text-sm text-slate-400">

                            {settings.autoLogoutMinutes} minutes

                        </p>

                    </div>

                </div>

            </section>

            {/* ================================================= */}
            {/* ACTIVE SESSIONS */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-semibold">

                        Active Sessions

                    </h2>

                    <button

                        onClick={logoutAllSessions}

                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500"

                    >

                        Logout All

                    </button>

                </div>

                <div className="mt-6 space-y-3">

                    {sessions.map(session => (

                        <div

                            key={session.id}

                            className="flex items-center justify-between rounded-lg border border-slate-800 p-4"

                        >

                            <div>

                                <div className="font-semibold">

                                    {session.device}

                                </div>

                                <div className="text-sm text-slate-400">

                                    {session.location}

                                </div>

                                <div className="text-xs text-slate-500">

                                    {session.ip}

                                </div>

                            </div>

                            <button

                                onClick={() =>

                                    logoutSession(session.id)

                                }

                                className="rounded-lg bg-slate-800 p-2 hover:bg-slate-700"

                            >

                                <LogOut size={18} />

                            </button>

                        </div>

                    ))}

                </div>

            </section>

            {/* ================================================= */}
            {/* TRUSTED DEVICES */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="mb-5 text-xl font-semibold">

                    Trusted Devices

                </h2>

                <div className="space-y-3">

                    {trustedDevices.map(device => (

                        <div

                            key={device.id}

                            className="flex items-center justify-between rounded-lg border border-slate-800 p-4"

                        >

                            <div>

                                <div className="font-semibold">

                                    {device.name}

                                </div>

                                <div className="text-sm text-slate-400">

                                    {device.addedAt}

                                </div>

                            </div>

                            <button

                                onClick={() =>

                                    removeTrustedDevice(device.id)

                                }

                                className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-500"

                            >

                                Remove

                            </button>

                        </div>

                    ))}

                </div>

            </section>

            {/* ================================================= */}
            {/* LOGIN HISTORY */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <h2 className="mb-5 text-xl font-semibold">

                    Login History

                </h2>

                <div className="space-y-3">

                    {history.map(item => (

                        <div

                            key={item.id}

                            className="flex items-center justify-between rounded-lg border border-slate-800 p-4"

                        >

                            <div>

                                <div className="font-semibold">

                                    {item.device}

                                </div>

                                <div className="text-sm text-slate-400">

                                    {item.location}

                                </div>

                            </div>

                            <div className="flex items-center gap-2">

                                {item.success ? (

                                    <CheckCircle2 className="text-green-400" size={18} />

                                ) : (

                                    <AlertTriangle className="text-red-400" size={18} />

                                )}

                                <span className="text-sm">

                                    {item.timestamp}

                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </div>

    );

}

/* ========================================================= */

function Toggle({

    icon,
    title,
    value,
    onChange

}:{

    icon: React.ReactNode;

    title: string;

    value: boolean;

    onChange: ()=>void;

}){

    return(

        <div className="flex items-center justify-between rounded-lg border border-slate-800 p-4">

            <div className="flex items-center gap-3">

                {icon}

                <span>{title}</span>

            </div>

            <input

                type="checkbox"

                checked={value}

                onChange={onChange}

            />

        </div>

    );

}