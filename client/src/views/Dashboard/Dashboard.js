import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTopics } from "../../Utils/requests"
import { removeUserSession, getUser } from "../../Utils/AuthRequests";
import './Dashboard.css'

function Dashboard(props) {
    const [topics, setTopics] = useState([])
    const [activities, setActivities] = useState([]) // temporary - eventually topics should render their activities
    const user = getUser();

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
        removeUserSession();
        props.history.push('/');
    }

    return (
        <div>
            Welcome {user.username}! <br />
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