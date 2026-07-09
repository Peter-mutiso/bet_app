"use client";

import {

    Clock3

} from "lucide-react";

const activities=[

{

time:"09:12",

event:"Grid Bot opened BUY BTC/USD."

},

{

time:"09:20",

event:"Trend Bot closed EUR/USD (+$124)."

},

{

time:"10:05",

event:"Scalper reached Take Profit."

},

{

time:"10:28",

event:"Mean Reversion paused."

},

{

time:"11:03",

event:"Grid Bot opened SELL Gold."

}

];

export default function BotActivity(){

return(

<section className="bot-activity">

<div className="section-title">

<h2>

Recent Bot Activity

</h2>

</div>

<div className="activity-list">

{

activities.map((activity,index)=>(

<div
key={index}
className="activity-item"
>

<Clock3 size={18}/>

<div>

<strong>

{activity.time}

</strong>

<p>

{activity.event}

</p>

</div>

</div>

))

}

</div>

</section>

);

}