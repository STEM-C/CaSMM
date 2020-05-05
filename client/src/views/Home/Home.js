import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from 'axios'
import './Home.css'

import {cms} from '../../config/development.json'

function Home(props) {
    const [activities, setActivities] = useState([]);

    // grab list of activities on component mount and assign to state activities
    useEffect( () => {
        const fetchActivities = async () => {
            const response = await axios.get(`${cms}/activities`);
            console.log('The list of activities are: ', response.data);

            await setActivities(response.data);
        }
        fetchActivities();
    }, [])

    const updateActivity = (value) => {
        props.setSelectedActivity(value);
    }

    return (
        <div className="cardList">
            {
                activities.map((activity, i) => {
                    return (
                        <Link to={`Home/${activities[i].name}`} key={activities[i].id} onClick={() => updateActivity(activities[i])}>
                            {activities[i].name}
                        </Link>
                    );
                })
            }
        </div>
    )
}

export default Home;