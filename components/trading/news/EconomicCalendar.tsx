"use client";

const events = [
    {
        id: 1,
        time: "08:30",
        country: "🇺🇸",
        event: "Non-Farm Payrolls",
        impact: "High",
        previous: "182K",
        forecast: "196K",
        actual: "205K",
    },
    {
        id: 2,
        time: "10:00",
        country: "🇪🇺",
        event: "ECB Interest Rate Decision",
        impact: "High",
        previous: "4.25%",
        forecast: "4.25%",
        actual: "4.25%",
    },
    {
        id: 3,
        time: "11:30",
        country: "🇬🇧",
        event: "Manufacturing PMI",
        impact: "Medium",
        previous: "51.8",
        forecast: "52.1",
        actual: "52.4",
    },
    {
        id: 4,
        time: "14:00",
        country: "🇯🇵",
        event: "BoJ Monetary Policy Statement",
        impact: "High",
        previous: "-0.10%",
        forecast: "-0.10%",
        actual: "-0.10%",
    },
    {
        id: 5,
        time: "16:00",
        country: "🇨🇦",
        event: "GDP (MoM)",
        impact: "Medium",
        previous: "0.3%",
        forecast: "0.4%",
        actual: "--",
    },
    {
        id: 6,
        time: "18:30",
        country: "🇦🇺",
        event: "Retail Sales",
        impact: "Low",
        previous: "0.5%",
        forecast: "0.6%",
        actual: "--",
    },
];

export default function EconomicCalendar() {
    return (
        <section className="economic-calendar">

            <div className="section-header">

                <div>
                    <h2>Economic Calendar</h2>
                    <p>
                        Scheduled macroeconomic events affecting global markets.
                    </p>
                </div>

                <button className="calendar-filter">
                    Today
                </button>

            </div>

            <div className="calendar-table">

                <div className="calendar-head">

                    <span>Time</span>
                    <span>Country</span>
                    <span>Event</span>
                    <span>Impact</span>
                    <span>Previous</span>
                    <span>Forecast</span>
                    <span>Actual</span>

                </div>

                {events.map((event) => (

                    <div
                        key={event.id}
                        className="calendar-row"
                    >

                        <span>{event.time}</span>

                        <span>{event.country}</span>

                        <span className="calendar-event">
                            {event.event}
                        </span>

                        <span
                            className={`impact ${event.impact.toLowerCase()}`}
                        >
                            {event.impact}
                        </span>

                        <span>{event.previous}</span>

                        <span>{event.forecast}</span>

                        <span>{event.actual}</span>

                    </div>

                ))}

            </div>

        </section>
    );
}