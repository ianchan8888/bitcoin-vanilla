import React, { Component } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Brush } from "recharts"

export default class HistoricalPriceGraph extends Component {
    render() {
        return (
            <div className="historical-graph" >
                <AreaChart data={this.props.graphData} width={960} height={640} isAnimationActive="true" >
                    <XAxis dataKey="date" />
                    <YAxis domain={["auto", "auto"]} type="number" padding={{ top: 100 }} />
                    <Area type="natural" dataKey="value" stroke="#001529" fill="rgb(24, 129, 170)" activeDot={{ r: 5 }} />
                    <CartesianGrid strokeDasharray="1" />
                    <Brush />
                    <Tooltip cursor={{ stroke: "rgb(24, 129, 170)", strokeWidth: 1 }} />
                </AreaChart>
            </div>
        )
    }
}