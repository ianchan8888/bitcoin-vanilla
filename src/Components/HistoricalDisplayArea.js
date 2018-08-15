import React, { Component } from "react"
import HistoricalPriceGraph from "./HistoricalPriceGraph"
import HistoricalPricesDisplayBox from "./HistoricalPricesDisplayBox"

export default class HistoricalDisplayArea extends Component {
    render() {
        return (
            <div className="b-container">
                <p><span className="block-text">Historical Data Updated At:</span>{this.props.historicalUpdateTime}</p>
                {!this.props.historicalError && this.props.prices.dates.length !== 0 ? 
                    (   
                        <div className="m-container">
                            <HistoricalPricesDisplayBox prices={this.props.prices} />
                            <HistoricalPriceGraph graphData={this.props.graphData} />
                        </div>
                    ) : (
                        <div className="m-container">
                            <h3>Historical Price API Error</h3>
                        </div>
                    )
                }
            </div>
        )
    }
}