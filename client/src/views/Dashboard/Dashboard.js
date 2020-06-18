import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTopics } from "../../dataaccess/requests"
import './Dashboard.css'

function Dashboard(props) {
    const [topics, setTopics] = useState([])
    const [activities, setActivities] = useState([]) // temporary - eventually topics should render their activities

    useEffect(() => {
        localStorage.clear()

        getTopics().then(topics => {
            // temporary - put all the activities into one array for current rendering
            let activities = []
            topics.forEach(topic => activities = activities.concat(topic.activities))

            setTopics(topics)
            setActivities(activities)
        })
    }, [])

    const handleLogout = () => {
        props.history.push('/login')
    }

    return (
        <div>
            <input type='button' onClick={handleLogout} value="Logout" />
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

export default Dashboard;