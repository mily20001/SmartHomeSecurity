import React from 'react';
import PropTypes from 'prop-types';
import './header.css';

export default class Header extends React.Component {
    render() {
        const okStatus = (<span className="ok">connected</span>);
        const notOkStatus = (<span className="notOk">disconnected</span>);
        return (
            <div className="header">
                <div className="headerTitle">
                    Smart Home Security
                </div>
                <div className="headerStatus">
                    Database: {this.props.dbStatus === 1 ? okStatus : notOkStatus}
                    {' \u00A0 '}
                    MQTT: {this.props.mqttStatus === 1 ? okStatus : notOkStatus}
                </div>
            </div>
        );
    }
}

Header.propTypes = {
    // height: PropTypes.number.isRequired,
    dbStatus: PropTypes.number.isRequired,
    mqttStatus: PropTypes.number.isRequired,
};
