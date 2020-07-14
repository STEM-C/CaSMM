import React, {useEffect, useState} from "react"
import "./Workspace.less"
import {getActivityToolbox} from "../../Utils/requests.js"
import {getToken} from "../../Utils/AuthRequests"
import Logo from "../../assets/casmm_logo.png"
import PlaceHolderImg1 from "../../assets/science.png"
import PlaceHolderImg2 from "../../assets/arduino.png"
import PlaceHolderImg3 from "../../assets/maker.png"
import {Carousel} from 'antd';
import BlocklyCanvasPanel from "../../components/BlocklyCanvasPanel/BlocklyCanvasPanel";


export default function Workspace(props) {
    const [activity, setActivity] = useState({})

    useEffect(() => {
        const localActivity = localStorage.getItem("my-activity")
        const {selectedActivity} = props

        if (localActivity && !selectedActivity) {
            let loadedActivity = JSON.parse(localActivity)
            setActivity(loadedActivity)

        } else if (selectedActivity) {
            getActivityToolbox(selectedActivity.id, getToken()).then(response => {
                let loadedActivity = {...selectedActivity, toolbox: response.toolbox}

                localStorage.setItem("my-activity", JSON.stringify(loadedActivity))
                setActivity(loadedActivity)
            })
        } else {
            props.history.push('/')
        }
    }, [props])

    return (
        <div>
            <div className="container flex flex-row">
                <div id='horizontal-container' className="flex flex-column">
                    <div id="top-container" className="flex flex-column vertical-container">
                        <div id="description-container"
                             className="flex flex-row justify-end card overflow-visible"
                             style={{"marginLeft": "70px"}}>
                            <img src={Logo} id='logo' alt="Maker activity"/>
                            <h2>Maker Activity {activity.name}</h2>
                        </div>
                    </div>
                    <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
                        <div id="section-header">
                            Learn about the activity...
                        </div>
                        <p id="section-text">{activity.description}</p>
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
                <div id='horizontal-container' className="flex flex-column">
                    <BlocklyCanvasPanel activity={activity} activityType={"my-activity"}/>
                </div>
            </div>
        </div>
    );

}
