import React from 'react';
import PropTypes from 'prop-types';
import './tiles.css';
import motionIcon from './motion.png';
import {Textfit} from 'react-textfit';
import ContainerDimensions from 'react-container-dimensions'

export default class Motion extends React.Component {
    render() {
        const imgWidth = 135; //omg ;-;

        return (
            <div
                className="motion"
                style={{display: 'flex', height: `${this.props.height}px`, textAlign: 'left'}}
            >
                <img alt="" draggable="false" src={motionIcon}
                     style={{paddingTop: '10px', paddingLeft: '5px', paddingRight: '15px'}} height="225px"/>
                <ContainerDimensions>
                    { ({width}) =>
                        <div style={{
                            height: `${this.props.height}px`,
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: '1'
                        }}>

                            <div style={{height: `${this.props.height / 2 - 1}px`, display: 'flex'}}>

                                <div
                                    className="motionStatusText"
                                    style={{
                                        width: width - imgWidth - 3,
                                        lineHeight: `${(this.props.height - 10) / 2}px`
                                    }}
                                >
                                    <Textfit mode="single">
                                        {this.props.lastMotion.toLocaleTimeString()}
                                    </Textfit>
                                </div>

                            </div>
                            <div style={{height: `${this.props.height / 2 - 1}px`, display: 'flex'}}>

                                <div
                                    className="motionStatusText"
                                    style={{
                                        width: width - imgWidth - 3,
                                        lineHeight: `${(this.props.height - 10) / 2}px`
                                    }}
                                >
                                    <Textfit mode="single">
                                        {this.props.lastMotion.toLocaleDateString()}
                                    </Textfit>
                                </div>

                            </div>

                        </div>
                    }
                </ContainerDimensions>
            </div>
        );
    }
}

Motion.propTypes = {
    height: PropTypes.number.isRequired,
    lastMotion: PropTypes.object.isRequired,
};
