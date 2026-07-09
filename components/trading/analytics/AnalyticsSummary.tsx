"use client";

import {

    TrendingUp,
    Percent,
    Activity,
    DollarSign

} from "lucide-react";

const cards=[

{

title:"Net Profit",

value:"+$12,420",

icon:TrendingUp

},

{

title:"Win Rate",

value:"73%",

icon:Percent

},

{

title:"Trades",

value:"1,284",

icon:Activity

},

{

title:"Average Return",

value:"+4.8%",

icon:DollarSign

}

];

export default function AnalyticsSummary(){

return(

<section className="analytics-summary">

{

cards.map(card=>{

const Icon=card.icon;

return(

<div
key={card.title}
className="analytics-card"
>

<Icon size={28}/>

<h2>

{card.value}

</h2>

<p>

{card.title}

</p>

</div>

);

})

}

</section>

);

}