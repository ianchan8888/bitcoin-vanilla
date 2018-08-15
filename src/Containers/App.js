import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Header from "../Components/Header"
import RealTimeDataDisplayArea from "../Components/RealTimeDataDisplayArea"
import WebSocketStatusBox from "../Components/WebSocketStatusBox"
import HistoricalDisplayArea from "../Components/HistoricalDisplayArea"
import { websocketConnect } from "../Actions/websocketActions"

class App extends Component {
    render() {
        const { prices, graphData, error, updateTime, loading } = this.props.historicalPrices
        const { wsConnected, wsStatus, channel, message, eventTime } = this.props.websocket
        const { priceData, priceMovement, realTimeGraphData } = this.props.realTimePriceData

        return (
            <div className="container" >
                <Header />

                {wsConnected && message.ok === "ok" ? 
                    (
                        <div>
                            <RealTimeDataDisplayArea wsStatus={wsStatus} wsChannel={channel}
                                realTimePriceData={priceData} priceMovement={priceMovement} realTimeGraphData={realTimeGraphData}
                            />
                        </div>

                    ) : (
                        <div className="b-container">
                            <WebSocketStatusBox wsStatus={wsStatus} eventTime={eventTime} connect={this.props.websocketConnect} />
                        </div>
                    )
                }

                {!loading ?
                    (
                        <div>
                            <HistoricalDisplayArea historicalUpdateTime={updateTime} historicalError={error}
                                prices={prices} graphData={graphData} />
                        </div>
                    ) : (
                        <div className="b-container">
                            <h3>Historical Price API Fetching</h3>
                        </div>
                    )
                }
            </div>
        )
    }
}

const mapStateToProps = ({ historicalPrices, websocket, realTimePriceData }) => ({
    historicalPrices, websocket, realTimePriceData
})

App.propTypes = {
    bpi: PropTypes.object,
    time: PropTypes.object,
    updateTime: PropTypes.string
}

export default connect(mapStateToProps, { websocketConnect })(App)

