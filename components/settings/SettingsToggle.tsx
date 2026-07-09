"use client";

interface Props {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}

export default function SettingsToggle({
    label,
    description,
    checked,
    onChange,
}: Props) {
    return (
        <div className="settings-toggle">

            <div className="settings-toggle-info">

                <h4>{label}</h4>

                <p>{description}</p>

            </div>

            <label className="settings-switch">

                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />

                <span className="settings-slider"></span>

            </label>

        </div>
    );
}