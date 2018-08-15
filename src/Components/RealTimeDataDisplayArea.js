import React, { Component } from "react"
import RealTimePricesDisplayBox from "../Components/RealTimePricesDisplayBox"
import RealTimePriceGraph from "../Components/RealTimePriceGraph"

export default class HistoricalDisplayArea extends Component {
    render() {
        return (
            <div className="b-container">
                {this.props.wsStatus !== "error" && this.props.realTimePriceData.bid.length !== 0 ?
                    (
                        <div className="m-container">
                            <RealTimePricesDisplayBox priceData={this.props.realTimePriceData} priceMovement={this.props.priceMovement}
                                wsChannel={this.props.wsChannel} />
                            <RealTimePriceGraph graphData={this.props.realTimeGraphData} />
                        </div>
                    ) : (
                        <h3>RealTime API Error</h3>
                    )
                }
            </div>
        )
    }
}