import React, {useEffect, useState} from 'react';
import {AutoComplete, Card, Checkbox} from "antd";
import './ActivityCatalogue.less'
import {getActivities} from "../../../Utils/requests";
import {getToken} from "../../../Utils/AuthRequests";
import CheckUnits from "./CheckUnits";

export default function ActivityCatalogue(props) {
    const [searchOptions, setSearchOptions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [visibleActivities, setVisibleActivities] = useState([]);
    const {history, selected, setSelected, activePanel, setActivePanel} = props;

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

    return (
        <div className='overflow-hidden'>
            <div id='panel-1' className={activePanel === "panel-1" ? "panel-1 show" : "panel-1 hide"}>
                <div className='flex flex-column'>
                    <div id='search'>
                        <AutoComplete
                            options={searchOptions}
                            placeholder="Search learning standards"
                            onSelect={onSelect}
                            onSearch={onSearch}
                        />
                    </div>
                    <div>
                        <CheckUnits/>
                    </div>
                </div>
                <div id='list-container'>
                    {visibleActivities.map(activity =>
                        <div key={activity.id}
                             id={selected.id !== activity.id ? 'list-item-wrapper' : 'selected-activity'}
                             onClick={() => setSelected(activity)}>
                            <li>
                                {activity.name}
                            </li>
                        </div>
                    )}
                </div>
            </div>
            <div id='panel-2' className={activePanel === "panel-2" ? "panel-2 show" : "panel-2 hide"}>
                <button id='back-btn' onClick={() => setActivePanel('panel-1')}>
                    <i className="fa fa-arrow-left" aria-hidden="true"/>
                </button>
                <div>
                    <p>Description: {selected.description}</p>
                    <p>Difficulty: {selected.difficulty ? selected.difficulty.name : ''}</p>
                    <p>Learning Category: {selected.learning_category ? selected.learning_category.name : ''}</p>
                </div>
            </div>
        </div>
    )
}