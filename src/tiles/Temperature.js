import React from 'react';
import PropTypes from 'prop-types';
import './tiles.css';
import termometer from './termometer.png';
import { Textfit } from 'react-textfit';
import ContainerDimensions from 'react-container-dimensions'
import { LineChart, Line, XAxis, YAxis } from 'recharts';

export default class Temperature extends React.Component {
    render() {
        const imgWidth = 110; //omg ;-;

        this.tickFormatTime = (time) => {
            const d = new Date(time);
            return `${d.getHours()}:${d.getMinutes()}`;
        };

        return (
            <div
                className="temperature"
                style={{display: 'flex', flexDirection: 'column', height: `${this.props.height - 2}px`, textAlign: 'left'}}
            >
                <div style={{height: `${this.props.height/2-1}px`, display: 'flex'}}>
                    <img alt="" draggable="false" src={termometer} style={{paddingTop: '10px'}} height="100px"/>

                    <ContainerDimensions>
                        { ({ width }) =>
                            <div
                                className="armedStatusText"
                                style={{width: width-imgWidth-3, lineHeight: `${(this.props.height-10)/2}px`}}
                            >
                                <Textfit mode="single">
                                    {this.props.currentTemp > -274 ? `${this.props.currentTemp}°C` : 'Loading...'}
                                </Textfit>
                            </div>
                        }
                    </ContainerDimensions>
                </div>
                <div style={{height: `${this.props.height/2-1}px`, borderTop: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex'}}>
                    <ContainerDimensions>
                        { ({width, height}) =>
                            <LineChart
                                width={width}
                                height={height}
                                data={this.props.tempHistory}
                                margin={{ top: 8, right: 25, left: -10, bottom: 1 }}
                            >
                                <XAxis stroke="white" dataKey="time" scale="time" tickFormatter={this.tickFormatTime}/>
                                <YAxis unit="°" stroke="white" type="number" domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                                <Line type="monotone" dataKey="temp" stroke="#c1d3ff"/>
                            </LineChart>
                        }
                    </ContainerDimensions>
                </div>


            </div>
        );
    }
}

Temperature.propTypes = {
    height: PropTypes.number.isRequired,
    currentTemp: PropTypes.number.isRequired,
    tempHistory: PropTypes.array.isRequired,
};
