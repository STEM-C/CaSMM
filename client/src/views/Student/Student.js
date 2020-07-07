import React, {useState, useEffect} from 'react'
import {getToken} from "../../Utils/AuthRequests"
import {getActivities} from "../../Utils/requests"
import './Student.less'

function Student(props) {
    const [activityList, setActivityList] = useState([]);
    const [error, setError] = useState(null);
    const {selectedActivity, setSelectedActivity} = props;

    useEffect(() => {
        const jwt = getToken()
        getActivities(jwt).then(activity => {
            setActivityList(activity)
        })

    }, [])

    const handleSelection = (activity) => {
        setSelectedActivity(activity);
        setError(null);
    };

    const handleLaunchActivity = (setError) => {
        if(selectedActivity.id) {
            props.history.push("/workspace")
        }
        else {
            setError('Please select an activity.')
            console.log('asldfkasldkfj')
        }
    };

    return (
        <div className='container flex justify-center'>
            <div id='activity-container'>
                <div id='header'>
                    <h1>Select your Activity</h1>
                </div>
                <ul>
                    {
                        activityList.map(activity =>
                            <div id={selectedActivity.id !== activity.id ? 'list-item-wrapper' : 'selected-activity'}
                                 onClick={() => handleSelection(activity)}>
                                <li key={activity.id}>
                                    {activity.name}
                                </li>
                            </div>
                        )
                    }
                </ul>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <div id='launcher' className='flex flex-column' onClick={() => handleLaunchActivity(setError)}>
                <i className="fa fa-rocket" aria-hidden="true"/>
                Launch Activity
                </div>
            </div>
        </div>
    )
}

export default Student