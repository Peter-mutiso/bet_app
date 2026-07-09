"use client";

const bots=[

{

name:"Grid Bot",

market:"BTC/USD",

status:"Running",

profit:"+4.12%"

},

{

name:"Trend Bot",

market:"EUR/USD",

status:"Paused",

profit:"+1.84%"

},

{

name:"Scalper",

market:"NAS100",

status:"Running",

profit:"+6.40%"

},

{

name:"Mean Reversion",

market:"Gold",

status:"Stopped",

profit:"-0.60%"

}

];

export default function ActiveBots(){

return(

<section className="active-bots">

<div className="section-title">

<h2>

Active Bots

</h2>

</div>

<div className="bots-grid">

{

bots.map(bot=>(

<div
key={bot.name}
className="bot-card"
>

<h3>

{bot.name}

</h3>

<p>

{bot.market}

</p>

<span>

{bot.status}

</span>

<strong>

{bot.profit}

</strong>

</div>

))

}

</div>

</section>

);

}