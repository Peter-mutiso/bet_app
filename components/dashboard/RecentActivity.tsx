"use client";

import {

    Activity,
    ArrowDownCircle,
    ArrowUpCircle,
    Trophy,
    CircleDollarSign,
    Bell,
    LogIn

} from "lucide-react";

interface ActivityItem {

    id: string;

    title: string;

    time: string;

}

interface RecentActivityProps {

    activities: ActivityItem[];

}

export default function RecentActivity({

    activities

}: RecentActivityProps) {

    function activityIcon(title: string) {

        const text = title.toLowerCase();

        if (text.includes("deposit"))
            return <ArrowDownCircle size={18} />;

        if (text.includes("withdraw"))
            return <ArrowUpCircle size={18} />;

        if (text.includes("win"))
            return <Trophy size={18} />;

        if (text.includes("trade"))
            return <CircleDollarSign size={18} />;

        if (text.includes("login"))
            return <LogIn size={18} />;

        if (text.includes("alert"))
            return <Bell size={18} />;

        return <Activity size={18} />;
    }

    return (

        <section className="dashboard-recent-activity">

            <div className="section-header">

                <h2>

                    Recent Activity

                </h2>

                <span>

                    {activities.length} Events

                </span>

            </div>

            {

                activities.length === 0 ? (

                    <div className="empty-state">

                        No recent activity.

                    </div>

                ) : (

                    <div className="activity-timeline">

                        {

                            activities.map(activity => (

                                <div

                                    key={activity.id}

                                    className="activity-item"

                                >

                                    <div className="activity-icon">

                                        {

                                            activityIcon(activity.title)

                                        }

                                    </div>

                                    <div className="activity-content">

                                        <strong>

                                            {activity.title}

                                        </strong>

                                        <small>

                                            {

                                                new Date(

                                                    activity.time

                                                ).toLocaleString()

                                            }

                                        </small>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </section>

    );

}