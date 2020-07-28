import React, {useEffect, useState} from 'react';
import {AutoComplete, Divider} from "antd";
import './LearningStandardSelect.less'
import {
    getLearningStandard,
    getUnits
} from "../../../Utils/requests";
import {getToken} from "../../../Utils/AuthRequests";
import CheckUnits from "./CheckUnits";

export default function LearningStandardSelect(props) {
    const [searchOptions, setSearchOptions] = useState([]);
    const [units, setUnits] = useState([]);
    const [visibleStandardsByUnit, setVisibleStandardsByUnit] = useState([]);
    const {history, selected, setSelected, activePanel, setActivePanel, gradeId} = props;

    useEffect(() => {
        async function fetchData() {
            const u = await getUnits(gradeId, getToken());
            setUnits(u);
            setVisibleStandardsByUnit(u);
        };
        fetchData()
    }, [setVisibleStandardsByUnit]);

    const getSelectedLearningStandard = async standard => {
        const newStandard = await getLearningStandard(standard.id, getToken());
        setSelected(newStandard)
    };

    const getFinishedWords = word => {
        let words = [];
        units.forEach(unit => {
            console.log(unit)
            unit.learning_standards.forEach(ls => {
                if (ls.name.toLowerCase().startsWith(word.toLowerCase())) {
                        words.push({value: ls.name})
                    }
                }
            )
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
        let visible = [];
        units.forEach(unit => {
            let u = {...unit};
            u.learning_standards = unit.learning_standards.filter(ls => {
            return values.includes(ls.name)
            });
            if(u.learning_standards.length > 0) {
                console.log(u.learning_standards)
                visible.push(u)}
        });
        visible.length > 0 ? setVisibleStandardsByUnit(visible) : setVisibleStandardsByUnit(units)
    };

    const onSelect = value => {
        let visible = units.filter(activity => {
            return activity.name === value
        });
        visible.length > 0 ? setVisibleStandardsByUnit(visible) : setVisibleStandardsByUnit(units)
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
                    {visibleStandardsByUnit.map(unit =>
                        <div>
                            <Divider orientation="left">{`Unit ${unit.number}- ${unit.name}`}</Divider>
                            {unit.learning_standards.map(ls =>
                                <div key={ls.id}
                                     id={selected.id !== ls.id ? 'list-item-wrapper' : 'selected-activity'}
                                     onClick={() => getSelectedLearningStandard(ls)}>
                                    <li>
                                        {ls.name}
                                    </li>
                                </div>
                            )}
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