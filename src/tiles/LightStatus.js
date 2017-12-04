import React from 'react';
import PropTypes from 'prop-types';
import './tiles.css';
import lightOn from './light_on.png';
import lightOff from './light_off.png';
import { Textfit } from 'react-textfit';
import ContainerDimensions from 'react-container-dimensions'

export default class LightStatus extends React.Component {
    render() {
        const imgWidth = 110; //omg ;-;
        const icon = (this.props.status ? lightOn : lightOff);

        let text = '';

        if(this.props.status === 0)
            text = 'OFF';
        else if(this.props.status === 1)
            text = 'ON';
        else
            text = 'Loading...';

        return (
            <div className="lightStatus" style={{display: 'flex', height: this.props.height, textAlign: 'left'}}>
                <img alt="" draggable="false" src={icon} style={{paddingTop: '10px'}} height="100px"/>

                <ContainerDimensions>
                    { ({ width }) =>
                        <div className="lightStatusText" style={{width: width-imgWidth-3, lineHeight: this.props.height}}>
                            <Textfit mode="single">{text}</Textfit>
                        </div>
                    }
                </ContainerDimensions>

            </div>
        );
    }
}

LightStatus.propTypes = {
    height: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
};
