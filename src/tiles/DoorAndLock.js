import React from 'react';
import PropTypes from 'prop-types';
import './tiles.css';
import doorOpen from './door_open.png';
import doorClosed from './door_closed.png';
import lockOpen from './locker_open.png';
import lockClosed from './locker_closed.png';
import { Textfit } from 'react-textfit';
import ContainerDimensions from 'react-container-dimensions'

export default class DoorAndLock extends React.Component {
    render() {
        const imgWidth = 110; //omg ;-;

        const doorStatusText = {
            '-1': 'Loading...',
            0: 'CLOSED',
            1: 'OPEN',
        };

        const lockStatusText = {
            '-1': 'Loading...',
            0: 'LOCKED',
            1: 'UNLOCKED',
        };

        return (
            <div
                className="doorAndLock"
                style={{display: 'flex', flexDirection: 'column', height: `${this.props.height}px`, textAlign: 'left'}}
            >
                <div style={{height: `${this.props.height/2-1}px`, display: 'flex'}}>
                    <img alt="" draggable="false" src={this.props.doorStatus === 1 ? doorOpen : doorClosed} style={{paddingTop: '10px'}} height="100px"/>

                    <ContainerDimensions>
                        { ({ width }) =>
                            <div
                                className="doorAndLockStatusText"
                                style={{width: width-imgWidth-3, lineHeight: `${(this.props.height-10)/2}px`}}
                            >
                                <Textfit mode="single">
                                    {doorStatusText[this.props.doorStatus]}
                                </Textfit>
                            </div>
                        }
                    </ContainerDimensions>
                </div>
                <div style={{height: `${this.props.height/2-1}px`, borderTop: '1px solid rgba(0, 0, 0, 0.3)', display: 'flex'}}>
                    <img alt="" draggable="false" src={this.props.lockStatus === 1 ? lockOpen : lockClosed} style={{paddingTop: '10px'}} height="100px"/>
                    <ContainerDimensions>
                        { ({ width }) =>
                            <div
                                className="doorAndLockStatusText"
                                style={{width: width-imgWidth-3, lineHeight: `${(this.props.height-10)/2}px`}}
                            >
                                <Textfit mode="single">
                                    {lockStatusText[this.props.lockStatus]}
                                </Textfit>
                            </div>
                        }
                    </ContainerDimensions>
                </div>


            </div>
        );
    }
}

DoorAndLock.propTypes = {
    height: PropTypes.number.isRequired,
    doorStatus: PropTypes.number.isRequired,
    lockStatus: PropTypes.number.isRequired,
};
