import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTopics } from "../../Utils/requests"
import { removeUserSession, getUser } from "../../Utils/AuthRequests";
import './Dashboard.css'

import Header from '../../components/Header.js'

function Dashboard(props) {
    const [activities, setActivities] = useState([]) // temporary - eventually topics should render their activities
    const user = getUser();

    useEffect(() => {
        localStorage.clear()

        getTopics().then(topics => {
            // temporary - put all the activities into one array for current rendering
            let activities = []
            topics.forEach(topic => activities = activities.concat(topic.activities))

            setActivities(activities)
        })
    }, [])

    const handleLogout = () => {
        removeUserSession();
        props.history.push('/');
    }

    return (
        <div>
            <Header user={user.username} handleLogout={handleLogout}/>
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