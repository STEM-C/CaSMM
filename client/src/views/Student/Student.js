import React, {useState, useEffect} from 'react'
import { getToken } from "../../Utils/AuthRequests"
import { getActivities} from "../../Utils/requests"

function Student(props) {
    const [activityList, setActivityList] = useState([])

    useEffect(() => {
        getToken().then(jwt => {
            getActivities(jwt).then(activity => {
                setActivityList(activity)
            })
        })
    }, [])

    const handleSelection = (activity) => {
        props.setSelectedActivity(activity)
        props.history.push("/workspace")
    }

    return (
        <div>
            <h1>Please select the activity to start</h1>
            <ul>
                {
                    activityList.map(activity =>
                        <li key={activity.id} onClick={() => handleSelection(activity)}>
                            {activity.name}
                        </li>
                    )
                }
            </ul>
        </div>
    )
}

export default Student