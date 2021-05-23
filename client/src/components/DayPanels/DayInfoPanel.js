import React from 'react';
import Logo from "../../assets/casmm_logo.png";
import './DayPanels.less'
import {Carousel} from "antd";
import PlaceHolderImg1 from "../../assets/science.png";
import PlaceHolderImg2 from "../../assets/arduino.png";
import PlaceHolderImg3 from "../../assets/maker.png";

// THIS PAGE IS NO LONGER IN USE,  SOME OF THE STYLING MAY NO LONGER APPLY
export default function DayInfoPanel(props) {
    const {day} = props;

    return(
        <div id='horizontal-container' className="flex flex-column">
            <div id="top-container" className="flex flex-column vertical-container">
                <div id="description-container"
                     className="flex flex-row justify-end card overflow-visible"
                     style={{"marginLeft": "70px"}}>
                    <img src={Logo} id='logo' alt="Maker activity"/>
                    <h2>{`Learning Standard ${day.learning_standard}, Day ${day.number}`}</h2>
                </div>
            </div>
            <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
                <div id="section-header">
                    Learn about the activity...
                </div>
                <p id="section-text">{/* TODO: Add day info */}</p>
                <div id="secondary-section-header">
                    See the different parts of the activity...
                </div>
                {/* Example implementation of image Carousel */}
                <div id="carousel-container">
                    <Carousel dotPosition={"left"}>
                        <div id="diagram-container">
                            <img id="diagram" src={PlaceHolderImg1} alt="First diagram in carousel"/>
                        </div>
                        <div id="diagram-container">
                            <img id="diagram" src={PlaceHolderImg2} alt="Second diagram in carousel"/>
                        </div>
                        <div id="diagram-container">
                            <img id="diagram" src={PlaceHolderImg3} alt="Third diagram in carousel"/>
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    )
}
