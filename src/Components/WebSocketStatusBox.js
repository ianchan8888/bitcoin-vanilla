import React, { Component } from "react"
import classNames from "classnames"

export default class WebSocketNotConnectedBox extends Component {
    render() {
        const status = this.props.wsStatus

        const statusColourClass = classNames({
            originalTextColour: status === "connecting",
            redTextColour: status === "error" || status === "close",
        })

        return (
            <div>
                <h3>Web-Socket</h3>
                <p><span className="block-text">Status: </span> <span className={statusColourClass}> {status} </span></p>
                {this.props.eventTime && <p><span className="block-text">Disconnected At: </span>{this.props.eventTime}</p>}
                {status !== "connecting" && <button onClick={this.props.connect} className="main-button">Re-Connect</button>}
            </div>
        )
    }
}