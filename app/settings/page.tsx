"use client";

import { useState } from "react";

import { useSettingsStore } from "@/store/useSettingsStore";
import SettingsToggle from "@/components/settings/SettingsToggle";

export default function SettingsPage() {

    const settings = useSettingsStore();

    const [saved, setSaved] = useState(false);

    function saveChanges() {

        setSaved(true);

        setTimeout(() => {

            setSaved(false);

        }, 2000);

    }

    return (

        <div id="settingsPage" className="settings-page">

            {/* =============================================== */}
            {/* HEADER */}
            {/* =============================================== */}

            <header className="settings-header">

                <div className="settings-header-left">

                    <h1 className="settings-title">

                        Settings

                    </h1>

                    <p className="settings-subtitle">

                        Customize your trading experience.

                    </p>

                </div>

                <button
                    className="settings-save-btn"
                    onClick={saveChanges}
                >

                    Save Changes

                </button>

            </header>

            {saved && (

                <div className="settings-success">

                    ✓ Settings saved successfully.

                </div>

            )}

            {/* =============================================== */}
            {/* PROFILE */}
            {/* =============================================== */}

            <section
                id="settingsProfile"
                className="settings-card"
            >

                <h2 className="settings-section-title">

                    Profile

                </h2>

                <div className="settings-grid settings-grid-2">

                    <div className="settings-field">

                        <label>

                            Display Name

                        </label>

                        <input
                            value={settings.displayName}
                            onChange={(e)=>
                                settings.setDisplayName(e.target.value)
                            }
                        />

                    </div>

                    <div className="settings-field">

                        <label>

                            Email

                        </label>

                        <input
                            disabled
                            value={settings.email}
                        />

                    </div>

                    <div className="settings-field">

                        <label>

                            Country

                        </label>

                        <input
                            value={settings.country}
                            onChange={(e)=>
                                settings.setCountry(e.target.value)
                            }
                        />

                    </div>

                    <div className="settings-field">

                        <label>

                            Currency

                        </label>

                        <select
                            value={settings.currency}
                            onChange={(e)=>
                                settings.setCurrency(
                                    e.target.value as any
                                )
                            }
                        >

                            <option>KES</option>

                            <option>USD</option>

                            <option>EUR</option>

                        </select>

                    </div>

                </div>

            </section>

            {/* =============================================== */}
            {/* APPEARANCE */}
            {/* =============================================== */}

            <section
                id="settingsAppearance"
                className="settings-card"
            >

                <h2 className="settings-section-title">

                    Appearance

                </h2>

                <div className="settings-grid settings-grid-2">

                    <div className="settings-field">

                        <label>

                            Theme

                        </label>

                        <select
                            value={settings.theme}
                            onChange={(e)=>
                                settings.setTheme(
                                    e.target.value as any
                                )
                            }
                        >

                            <option value="dark">

                                Dark

                            </option>

                            <option value="light">

                                Light

                            </option>

                            <option value="system">

                                System

                            </option>

                        </select>

                    </div>

                    <div className="settings-field">

                        <div className="settings-range-header">

                            <label>

                                Font Size

                            </label>

                            <span>

                                {settings.fontScale}%

                            </span>

                        </div>

                        <input
                            type="range"
                            min={80}
                            max={130}
                            value={settings.fontScale}
                            onChange={(e)=>
                                settings.setFontScale(
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>

                </div>

            </section>

            {/* =============================================== */}
            {/* TRADING */}
            {/* =============================================== */}

            <section
                id="settingsTrading"
                className="settings-card"
            >

                <h2 className="settings-section-title">

                    Trading

                </h2>

                <div className="settings-grid settings-grid-3">

                    <div className="settings-field">

                        <label>

                            Default Stake

                        </label>

                        <input
                            type="number"
                            value={settings.defaultStake}
                            onChange={(e)=>
                                settings.setDefaultStake(
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>

                    <div className="settings-field">

                        <label>

                            Duration

                        </label>

                        <input
                            type="number"
                            value={settings.defaultDuration}
                            onChange={(e)=>
                                settings.setDefaultDuration(
                                    Number(e.target.value)
                                )
                            }
                        />

                    </div>

                    <div className="settings-field">

                        <label>

                            Default Contract

                        </label>

                        <select
                            value={settings.defaultContract}
                            onChange={(e)=>
                                settings.setDefaultContract(
                                    e.target.value as any
                                )
                            }
                        >

                            <option value="RISE">

                                RISE

                            </option>

                            <option value="FALL">

                                FALL

                            </option>

                            <option value="HIGHER">

                                HIGHER

                            </option>

                            <option value="LOWER">

                                LOWER

                            </option>

                        </select>

                    </div>

                </div>

            </section>

            {/* =============================================== */}
            {/* PREFERENCES */}
            {/* =============================================== */}

            <section
                id="settingsPreferences"
                className="settings-card"
            >

                <h2 className="settings-section-title">

                    Preferences

                </h2>

                <div className="settings-toggle-list">

                    <SettingsToggle
                        label="Confirm Trades"
                        description="Ask for confirmation before placing trades."
                        checked={settings.confirmTrades}
                        onChange={settings.toggleConfirmTrades}
                    />

                    <SettingsToggle
                        label="Trade Notifications"
                        description="Receive notifications when trades open or close."
                        checked={settings.tradeNotifications}
                        onChange={settings.toggleTradeNotifications}
                    />

                    <SettingsToggle
                        label="Deposit Notifications"
                        description="Receive deposit confirmation alerts."
                        checked={settings.depositNotifications}
                        onChange={settings.toggleDepositNotifications}
                    />

                    <SettingsToggle
                        label="Withdrawal Notifications"
                        description="Receive withdrawal status updates."
                        checked={settings.withdrawalNotifications}
                        onChange={settings.toggleWithdrawalNotifications}
                    />

                    <SettingsToggle
                        label="System Notifications"
                        description="Platform announcements and maintenance alerts."
                        checked={settings.systemNotifications}
                        onChange={settings.toggleSystemNotifications}
                    />

                    <SettingsToggle
                        label="Browser Notifications"
                        description="Allow browser push notifications."
                        checked={settings.browserNotifications}
                        onChange={settings.toggleBrowserNotifications}
                    />

                    <SettingsToggle
                        label="Sound Effects"
                        description="Play sounds for trading events."
                        checked={settings.soundEffects}
                        onChange={settings.toggleSoundEffects}
                    />

                    <SettingsToggle
                        label="Compact Mode"
                        description="Reduce spacing throughout the interface."
                        checked={settings.compactMode}
                        onChange={settings.toggleCompactMode}
                    />

                    <SettingsToggle
                        label="Two Factor Authentication"
                        description="Extra protection for your account."
                        checked={settings.twoFactorEnabled}
                        onChange={settings.toggleTwoFactor}
                    />

                </div>

            </section>

            {/* =============================================== */}
            {/* DANGER */}
            {/* =============================================== */}

            <section
                id="settingsDanger"
                className="settings-danger-card"
            >

                <h2 className="settings-danger-title">

                    Danger Zone

                </h2>

                <p className="settings-danger-text">

                    Reset every application preference back to its default value.

                </p>

                <button
                    className="settings-reset-btn"
                    onClick={settings.resetSettings}
                >

                    Reset Settings

                </button>

            </section>

        </div>

    );

}