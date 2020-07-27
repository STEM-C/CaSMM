import React, {useEffect, useState} from 'react';
import {AutoComplete} from "antd";
import './LearningStandardSelect.less'
import {
    getActivities,
    getClassroom,
    getLearningStandard,
    setSelection,
    getUnits
} from "../../../Utils/requests";
import {getToken} from "../../../Utils/AuthRequests";
import CheckUnits from "./CheckUnits";

export default function LearningStandardSelect(props) {
    const [searchOptions, setSearchOptions] = useState([]);
    const [learingStandards, setLearningStandards] = useState([]);
    const [visibleLearningStandards, setVisibleLearningStandards] = useState([]);
    const {history, selected, setSelected, activePanel, setActivePanel, gradeId} = props;

    useEffect(() => {
        async function fetchData() {
            const units = await getUnits(gradeId, getToken());
            let standards = [];
            await units.forEach(unit => {
                unit.learning_standards.forEach(ls => {
                    standards.push(ls)
                })
            });
            setLearningStandards(standards);
            setVisibleLearningStandards(standards);
        };
        fetchData()
    }, [setVisibleLearningStandards]);
    
    const getSelectedLearningStandard = async standard => {
        const newStandard = await getLearningStandard(standard.id, getToken());
        setSelected(newStandard)
    };

    const getFinishedWords = word => {
        let words = [];
        learingStandards.forEach(activity => {
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
        let visible = learingStandards.filter(activity => {
            return values.includes(activity.name)
        });
        visible.length > 0 ? setVisibleLearningStandards(visible) : setVisibleLearningStandards(learingStandards)
    };

    const onSelect = value => {
        let visible = learingStandards.filter(activity => {
            return activity.name === value
        });
        visible.length > 0 ? setVisibleLearningStandards(visible) : setVisibleLearningStandards(learingStandards)
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
                    {visibleLearningStandards.map(ls =>
                        <div key={ls.id}
                             id={selected.id !== ls.id ? 'list-item-wrapper' : 'selected-activity'}
                             onClick={() => getSelectedLearningStandard(ls)}>
                            <li>
                                {ls.name}
                            </li>
                        </div>
                    )}
                </div>
            </div>
            <div id='panel-2' className={activePanel === "panel-2" ? "panel-2 show" : "panel-2 hide"}>
                <button id='back-btn' onClick={() => setActivePanel('panel-1')}>
                    <i className="fa fa-arrow-left" aria-hidden="true"/>
                </button>
                <div id='ls-info'>
                    <p>Expectations: {selected.expectations}</p>
                    <div id="btn-container" className='flex space-between'>
                        {selected.days ? selected.days.map(day =>
                            <button>{`Day ${day.number}`}</button>
                        )
                        : null}
                    </div>
                </div>
            </div>
        </div>
    )
}