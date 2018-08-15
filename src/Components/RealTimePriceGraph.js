import React, { Component } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import moment from "moment"

export default class RealTimePriceGraph extends Component {
    render() {
        function formatXAxis(tickItem) {
            return moment(tickItem).format('MMM Do YY')
        }
        
        return (
            <LineChart data={this.props.graphData} width={720} height={480} >
                <XAxis dataKey="convertedTime" tickFormatter={formatXAxis}/>
                <YAxis type="number" domain={["auto", "auto"]}/>
                <CartesianGrid strokeDasharray="5"/>
                <Line type="monotone" dataKey="bid" stroke="#001529" activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="ask" stroke="#82ca9d" />
                <Tooltip />
            </LineChart>
        )
    }
}