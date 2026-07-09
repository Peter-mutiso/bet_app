"use client";

import {

    Lightbulb,

    Trophy,

    Calendar,

    TrendingUp

} from "lucide-react";

const insights=[

{

icon:Trophy,

title:"Best Performing Market",

value:"BTC/USD"

},

{

icon:Calendar,

title:"Best Trading Day",

value:"Wednesday"

},

{

icon:TrendingUp,

title:"Best Session",

value:"London Session"

},

{

icon:Lightbulb,

title:"Recommendation",

value:"Increase exposure to BTC/USD trend strategies."

}

];

export default function StrategyInsights(){

return(

<section className="strategy-insights">

<div className="section-title">

<h2>

Strategy Insights

</h2>

</div>

<div className="insights-grid">

{

insights.map(item=>{

const Icon=item.icon;

return(

<div
key={item.title}
className="insight-card"
>

<Icon size={26}/>

<h3>

{item.title}

</h3>

<p>

{item.value}

</p>

</div>

);

})

}

</div>

</section>

);

}