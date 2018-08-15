import React, { Component } from "react"
import PropTypes from "prop-types"

export default class HistoricalPricesDisplayBox extends Component {
    render() {
        return (
            <div>
                <table id="historical-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.prices.dates.map((date, i) => {
                            const value = this.props.prices.values[i]
                            return (
                                <tr key={date}>
                                    <td>{date}</td>
                                    <td>{Math.round(value)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

HistoricalPricesDisplayBox.propTypes = {
    date: PropTypes.string,
    value: PropTypes.string
}
