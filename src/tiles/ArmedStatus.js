import React from 'react';
import PropTypes from 'prop-types';
import './tiles.css';
import armedOk from './armed_ok.png';
import armedWarn from './armed_warn.png';
import armedNot from './armed_not.png';
import {Textfit} from 'react-textfit';
import ContainerDimensions from 'react-container-dimensions'

export default class ArmedStatus extends React.Component {
    constructor() {
        super();
        this.state = {
            choosing: false,
        };

        this.toggleChoosing = () => {
            this.setState({choosing: !this.state.choosing})
        };

        this.handleClick = (option) => {
            this.props.setAlarmStatus(option);
            this.setState({choosing: false})
        };

        this.toggleChoosing = this.toggleChoosing.bind(this);
    }

    render() {
        const imgWidth = 110; //omg ;-;
        const statuses = {
            '-1': {code: 'not_armed', description: 'Loading...', icon: armedNot},
            0: {code: 'not_armed', description: 'NOT ARMED', icon: armedNot},
            1: {code: 'armed', description: 'ARMED', icon: armedOk},
            2: {code: 'alarm', description: 'ALARM', icon: armedWarn},
        };

        // () => this.props.setAlarmStatus('1')

        // this.getTileContent(choosing) {
        //     if(!choosing) {
        //         return (
        //
        //         )
        //     }
        // }

        const isChoosing = this.state.choosing;

        return (
            <div
                className={`armedStatus ${statuses[this.props.status].code}`}
                style={{display: 'flex', height: `${this.props.height - 2}px`, textAlign: 'left', lineHeight: `${this.props.height - 2}px`}}
                onContextMenu={this.toggleChoosing}
            >
                {   !isChoosing &&
                <img alt="" draggable="false" src={statuses[this.props.status].icon} style={{paddingTop: '10px'}}
                     height="100px"/>
                }

                {   !isChoosing &&
                    < ContainerDimensions >
                    {({width}) =>
                        <div className="armedStatusText" style={{
                        width: width - imgWidth - 3,
                        lineHeight: `${this.props.height}px`
                    }}>
                        <Textfit mode="single">{`${statuses[this.props.status].description}`}</Textfit>
                        </div>
                    }
                        </ContainerDimensions>
                }

                {   isChoosing &&
                    <div className="arm" onClick={() => this.handleClick('1')}>
                        <Textfit mode="single">{'\u00A0'}{'\u00A0'}ARM{'\u00A0'}{'\u00A0'}</Textfit>
                    </div>
                }

                {   isChoosing &&
                <div className="disarm" onClick={() => this.handleClick('0')}>
                    <Textfit mode="single">DISARM</Textfit>
                </div>
                }


            </div>
        );
    }
}

ArmedStatus.propTypes = {
    height: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    setAlarmStatus: PropTypes.func.isRequired,
};
