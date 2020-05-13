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

    return (
        <div>

            <div className="cardList">
                <h2 className="cardHeader">Activity List</h2>
                {
                    activities.map((activity, i) => {
                        return (
                            <Link to={`Home/${activities[i].name}`} className="cardActivity" key={activities[i].id} onClick={() => props.setSelectedActivity(activities[i])}>
                                {activities[i].name}
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default Home;