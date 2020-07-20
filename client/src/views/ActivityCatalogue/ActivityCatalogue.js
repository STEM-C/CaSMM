import React, {useEffect, useState} from 'react';
import {AutoComplete, Card, Checkbox} from "antd";
import './ActivityCatalogue.less'
import MentorSubHeader from "../../components/MentorSubHeader/MentorSubHeader";
import {getActivities} from "../../Utils/requests";
import {getToken} from "../../Utils/AuthRequests";

export default function ActivityCatalogue(props) {
    const [searchOptions, setSearchOptions] = useState([]);
    const [activities, setActivities] = useState([])
    const [visibleActivities, setVisibleActivities] = useState([])
    const {history, setSelectedActivity, handleLogout} = props;

    useEffect(() => {
        async function fetchData() {
            const activities = await getActivities(getToken());
            setActivities(activities);
            setVisibleActivities(activities);
        };
        fetchData()
    }, [setVisibleActivities]);

    const getFinishedWords = word => {
        let words = [];
        activities.forEach(activity => {
            if (activity.name.toLowerCase().startsWith(word.toLowerCase())) {
                words.push({value: activity.name})
            }
        });
        return words
    };

    const onSearch = searchText => {
        let words = getFinishedWords(searchText);
        setSearchOptions(words);
        let values = [];
        words.forEach(word => {
            values.push(word.value)
        });
        let visible = activities.filter(activity => {
            return values.includes(activity.name)
        });
        visible.length > 0 ? setVisibleActivities(visible) : setVisibleActivities(activities)
    };

    const onSelect = value => {
        let visible = activities.filter(activity => {
            return activity.name === value
        });
        visible.length > 0 ? setVisibleActivities(visible) : setVisibleActivities(activities)
    };

    const setDayOptions = () => {
        let options = [];
        for (let i = 0; i < 5; i++) {
            options.push(<option key={i} value={i}>{`Day ${i + 1}`}</option>)
        }
        return options
    };

    return (
        <div className='container'>
            <div id='main-header'>Catalogue of Activities</div>
            <div className='flex flex-column'>
                <MentorSubHeader
                    title={'Available Activities:'}
                    toDashActive={true}
                    checkoutActive={true}
                    handleLogout={handleLogout}
                />
                <span id='search'>
                    <AutoComplete
                        options={searchOptions}
                        placeholder="Search activities"
                        onSelect={onSelect}
                        onSearch={onSearch}
                    />
                </span>
            </div>
            <div id='card-container'>
                {visibleActivities.map(activity =>
                    <Card id='activity-card' title={activity.name} key={activity.id}>
                        <div id='card-content-container'>
                            <p>Description: {activity.description}</p>
                            <p>Difficulty: {activity.difficulty.name}</p>
                            <p>Learning Category: {activity.learning_category.name}</p>
                        </div>
                        <div id='card-action-container' className='flex flex-row'>
                            <select name='day'>
                                {setDayOptions().map(option => option)}
                            </select>
                            <button onClick={() => {
                                setSelectedActivity(activity);
                                history.push('/activity')
                            }}>
                                View Activity
                            </button>
                            <div id='check'><Checkbox/></div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}