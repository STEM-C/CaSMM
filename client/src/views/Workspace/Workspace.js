import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { compileArduinoCode, getArduino, getJS, getXml, setLocalActivity } from './helpers.js'
import "./Workspace.less"
import { getActivityToolbox } from "../../Utils/requests.js"
import { getToken } from "../../Utils/AuthRequests"
import Logo from "../../assets/casmm_logo.png"
import PlaceHolderImg1 from "../../assets/science.png"
import PlaceHolderImg2 from "../../assets/arduino.png"
import PlaceHolderImg3 from "../../assets/maker.png"
import { Carousel } from 'antd';


function App(props) {

    const [activity, setActivity] = useState({} )
    const [hoverXml, setHoverXml] = useState(false)
    const [hoverJS, setHoverJS] = useState(false)
    const [hoverArduino, setHoverArduino] = useState(false)
    const [hoverCompile, setHoverCompile] = useState(false)

    let workspaceRef = useRef(null)

    const setWorkspace = () => workspaceRef.current = window.Blockly.inject('blockly-canvas', { toolbox: document.getElementById('toolbox') })

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

        // clean up - removes blockly div from DOM
        return () => {
            if (workspaceRef.current) workspaceRef.current.dispose()
        }
    }, [props])

    useEffect(() => {
        // once the activity state is set, set the workspace
        if (Object.keys(activity).length && !workspaceRef.current) {
            setWorkspace()
            workspaceRef.current.addChangeListener(() => setLocalActivity(workspaceRef.current))

            if (activity.template) {
                let xml = window.Blockly.Xml.textToDom(activity.template)
                window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current)
            }
        }
    }, [activity])

    return (
        <div>
            <div className="container flex flex-row">
                <div className="horizontal-container flex flex-column">
                    <div id="top-container" className="flex flex-column vertical-container">
                        <div id="description-container"
                             className="flex flex-row justify-end card overflow-visible"
                             style={{"marginLeft": "70px"}}>
                            <img src={Logo} className='logo' alt="Maker activity"/>
                            <h2>Maker Activity {activity.name}</h2>
                        </div>
                    </div>
                    <div className="bottom-container flex flex-column vertical-container overflow-visible">
                        <div className="section-header">
                                Learn about the activity...
                        </div>
                        <p className="section-text">{activity.description}</p>
                        <div className="secondary-section-header">
                            See the different parts of the activity...
                        </div>
                        {/* Example implementation of image Carousel */}
                        <div className="carousel-container">
                        <Carousel dotPosition={"left"}>
                            <div className="diagram-container">
                                <img className="diagram" src={PlaceHolderImg1} alt="First diagram in carousel"/>
                            </div>
                            <div className="diagram-container">
                                <img className="diagram" src={PlaceHolderImg2} alt="Second diagram in carousel"/>
                            </div>
                            <div className="diagram-container">
                                <img className="diagram" src={PlaceHolderImg3} alt="Third diagram in carousel"/>
                            </div>
                        </Carousel>
                        </div>
                    </div>
                </div>
                <div className="horizontal-container flex flex-column">
                    <div className="top-container flex flex-column vertical-container">
                        <div className="description-container flex flex-row space-between card">
                            <Link to={"/student"} className="flex flex-column">
                                <i className="fa fa-home" style={{"fontSize": "32px"}}/>
                                Home
                            </Link>
                            <div style={{"width": "25%"}}>
                                <div className="action-btn-container flex space-between">
                                    <i onClick={() => getXml(workspaceRef.current)} className="fas fa-code hvr-info"
                                       onMouseEnter={() => setHoverXml(true)}
                                       onMouseLeave={() => setHoverXml(false)}/>
                                    {hoverXml && <div className="popup JS">Shows Xml Code</div>}
                                    <i onClick={() => getJS(workspaceRef.current)} className="fab fa-js hvr-info"
                                       onMouseEnter={() => setHoverJS(true)}
                                       onMouseLeave={() => setHoverJS(false)}/>
                                    {hoverJS && <div className="popup JS">Shows Javascript Code</div>}
                                    <i onClick={() => getArduino(workspaceRef.current)} className="hvr-info"
                                       onMouseEnter={() => setHoverArduino(true)}
                                       onMouseLeave={() => setHoverArduino(false)}>A</i>
                                    {hoverArduino && <div className="popup Arduino">Shows Arduino Code</div>}
                                    <i onClick={() => compileArduinoCode(workspaceRef.current)}
                                       className="fas fa-play hvr-info"
                                       onMouseEnter={() => setHoverCompile(true)}
                                       onMouseLeave={() => setHoverCompile(false)}/>
                                    {hoverCompile && <div className="popup Compile">Run Program</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-container flex flex-column vertical-container overflow-visible">
                        <div className="section-header">
                                Program your Arduino...
                        </div>
                        <div id="blockly-canvas"
                             onChange={() => setLocalActivity(workspaceRef.current)}/>
                    </div>
                </div>
            </div>

            {/* This xml is for the blocks' menu we will provide. Here are examples on how to include categories and subcategories */}
            <xml id="toolbox" style={{ "display": "none" }} is="Blockly workspace">
                {
                    // Maps out block categories
                    activity.toolbox && activity.toolbox.map(([category, blocks]) => (
                        <category name={category} is="Blockly category" key={category}>
                            {
                                // maps out blocks in category
                                // eslint-disable-next-line
                                blocks.map((block) => {
                                    return <block type={block.name} is="Blockly block" key={block.name}/>
                                })
                            }
                        </category>
                    ))
                }
            </xml>
        </div>
    );

}

export default App;