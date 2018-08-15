import React, { Component } from "react"
import classNames from "classnames"

export default class RealTimePricesDisplayBox extends Component {
    render() {
        const { bidMovement, askMovement } = this.props.priceMovement
        const { pair, volume, bid, ask } = this.props.priceData

        const movementColourClass = classNames({
            originalBackground: true,
            redBackground: bidMovement === -1 || askMovement === -1,
            greenBackground: bidMovement === 1 || askMovement === 1
        })

        return (
            <div>
                <p><span className="block-text">Channel: </span>{this.props.wsChannel}</p>
                <p><span className="block-text">Trade Pair: </span>{pair.map((value) => (
                    <span key={value}>{value} </span>
                ))}</p>
                <p><span className="block-text">Volume: </span> {volume}</p>
                <table id="real-time-table">
                    <thead>
                        <tr>
                            <th>Bid</th>
                            <th>Ask</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={movementColourClass}>{bid}</td>
                            <td className={movementColourClass}>{ask}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}