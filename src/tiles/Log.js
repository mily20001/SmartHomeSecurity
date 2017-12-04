import React from 'react';
import PropTypes from 'prop-types';
import './tiles.css';
import ContainerDimensions from 'react-container-dimensions'

export default class Log extends React.Component {
    render() {

        const log = this.props.log.map((entry) => {
            return `[${entry.topic}] ${entry.message}\n`;
        });

        return (
            <ContainerDimensions>
                { ({width, height}) =>
                <div>
                    <div className="logTitle">LOG</div>
                    <div
                        className="log"
                        style={{
                            height: `${height - 52}px`,
                            width: `${width - 20}px`,
                        }}
                    >
                        {log}
                    </div>
                </div>
                }
            </ContainerDimensions>
        );
    }
}

Log.propTypes = {
    log: PropTypes.array.isRequired,
};
