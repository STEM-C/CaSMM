import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getTopics } from "../../dataaccess/topics"
import './Home.css'

function Home(props) {

    const [ topics, setTopics ] = useState([])
    const [ activities, setActivities ] = useState([]) // temporary - eventually topics should render their activities

    useEffect( () => {

        getTopics().then(topics => {

            // temporary - put all the activities into one arrary for current rendering
            let activities = []
            topics.forEach(topic => activities = activities.concat(topic.activities))

            setTopics(topics)
            setActivities(activities)
        })
    }, [])

    useEffect(() => {
        console.log(topics)
        console.log(activities)
    })

    return (
        <div>

            <div className="cardList">
                <h2 className="cardHeader">Activity List</h2>
                {
                    activities.map(activity => {
                        return (
                            <Link to="/workspace" className="cardActivity" key={activity.id} onClick={() => props.setSelectedActivity(activity)}>
                                {activity.name}
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default Home;