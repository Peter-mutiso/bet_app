"use client";

const trades = [

    {

        market:"BTC/USD",

        type:"BUY",

        profit:"+$214.52",

        duration:"5 min"

    },

    {

        market:"EUR/USD",

        type:"SELL",

        profit:"-$42.15",

        duration:"12 min"

    },

    {

        market:"Gold",

        type:"BUY",

        profit:"+$86.10",

        duration:"9 min"

    },

    {

        market:"ETH/USD",

        type:"SELL",

        profit:"+$125.30",

        duration:"15 min"

    }

];

export default function RecentPerformance(){

return(

<section className="recent-performance">

<div className="section-title">

<h2>

Recent Trades

</h2>

</div>

<table className="performance-table">

<thead>

<tr>

<th>Market</th>

<th>Type</th>

<th>Duration</th>

<th>P/L</th>

</tr>

</thead>

<tbody>

{

trades.map((trade,index)=>(

<tr key={index}>

<td>{trade.market}</td>

<td>{trade.type}</td>

<td>{trade.duration}</td>

<td
className={
trade.profit.startsWith("+")
?"profit"
:"loss"
}
>

{trade.profit}

</td>

</tr>

))

}

</tbody>

</table>

</section>

);

}