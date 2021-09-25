import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Divider, message, Tag } from 'antd';
import './LearningStandardSelect.less';
import {
  getLearningStandard,
  getUnits,
  getLearningStandardDays,
} from '../../../../Utils/requests';
import CheckUnits from './CheckUnits';

export default function LearningStandardSelect(props) {
  const [searchOptions, setSearchOptions] = useState([]);
  const [units, setUnits] = useState([]);
  const [visibleStandardsByUnit, setVisibleStandardsByUnit] = useState([]);
  const [plainOptions, setPlainOptions] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const {
    history,
    selected,
    setSelected,
    activePanel,
    setActivePanel,
    gradeId,
    days,
    setDays,
  } = props;

  useEffect(() => {
    async function fetchData() {
      const res = await getUnits(gradeId);
      if (res.data) {
        const u = res.data;
        setUnits(u);
        setVisibleStandardsByUnit(u);
        const options = u.map((unitData) => {
          return {
            id: unitData.id,
            number: unitData.number,
            name: unitData.name,
          };
        });
        setPlainOptions(options);
        setCheckedList(options);
      } else {
        message.error(res.err);
      }
    }
    if (gradeId) fetchData();
  }, [setVisibleStandardsByUnit, gradeId]);

  const getSelectedLearningStandard = async (standard) => {
    const res = await getLearningStandard(standard.id);
    if (res.data) {
      setSelected(res.data);
    } else {
      message.error(res.err);
    }
    const daysRes = await getLearningStandardDays(res.data.id);
    if (daysRes) setDays(daysRes.data);
    else {
      message.error(daysRes.err);
    }
  };

  const getFinishedWords = (word) => {
    let words = [];
    units.forEach((unit) => {
      if (checkedList.find((checked) => checked.id === unit.id)) {
        unit.learning_standards.forEach((ls) => {
          if (ls.name.toLowerCase().startsWith(word.toLowerCase())) {
            words.push({ value: ls.name });
          }
        });
      }
    });
    return words;
  };

  const onSearch = (searchText) => {
    let words = getFinishedWords(searchText);
    setSearchOptions(words);
    let values = [];
    words.forEach((word) => {
      values.push(word.value);
    });
    let visible = [];
    units.forEach((unit) => {
      let u = { ...unit };
      u.learning_standards = unit.learning_standards.filter((ls) => {
        return values.includes(ls.name);
      });
      if (u.learning_standards.length > 0) {
        visible.push(u);
      }
    });
    visible.length > 0
      ? setVisibleStandardsByUnit(visible)
      : setVisibleStandardsByUnit(units);
  };

  const onSelect = (value) => {
    let visible = units.filter((ls) => {
      return ls.name === value;
    });
    visible.length > 0
      ? setVisibleStandardsByUnit(visible)
      : setVisibleStandardsByUnit(units);
  };

  const handleViewDay = (day) => {
    day.learning_standard_name = selected.name;
    localStorage.setItem('my-day', JSON.stringify(day));
    history.push('/day');
  };

  const handleBack = () => {
    history.push('#home');
    setActivePanel('panel-1');
  };

  const color = [
    'magenta',
    'purple',
    'green',
    'cyan',
    'red',
    'geekblue',
    'volcano',
    'blue',
    'orange',
    'gold',
    'lime',
  ];

  const SCIENCE = 1;
  const MAKING = 2;
  const COMPUTATION = 3;

  return (
    <div className='overflow-hidden'>
      <div
        id='panel-1'
        className={activePanel === 'panel-1' ? 'panel-1 show' : 'panel-1 hide'}
      >
        <div className='flex flex-column'>
          <div id='search'>
            <AutoComplete
              options={searchOptions}
              placeholder='Search learning standards'
              onSelect={onSelect}
              onSearch={onSearch}
            />
          </div>
          <div id='check-units'>
            <CheckUnits
              plainOptions={plainOptions}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
            />
          </div>
        </div>
        <div id='list-container'>
          {visibleStandardsByUnit.map((unit) => {
            return checkedList.find((checked) => checked.id === unit.id) ? (
              <div key={unit.id}>
                <Divider orientation='left'>{`Unit ${unit.number}- ${unit.name}`}</Divider>
                {unit.learning_standards.map((ls) => (
                  <div
                    key={ls.id}
                    id={
                      selected.id !== ls.id
                        ? 'list-item-wrapper'
                        : 'selected-learning-standard'
                    }
                    onClick={() => getSelectedLearningStandard(ls)}
                  >
                    <li>{ls.name}</li>
                  </div>
                ))}
              </div>
            ) : null;
          })}
        </div>
      </div>
      <div
        id='panel-2'
        className={activePanel === 'panel-2' ? 'panel-2 show' : 'panel-2 hide'}
      >
        <button id='back-btn' onClick={handleBack}>
          <i className='fa fa-arrow-left' aria-hidden='true' />
        </button>
        <div id='ls-info'>
          <p id='learning-standard-expectations-title'>Expectations:</p>
          <p id='learning-standard-expectations'>{selected.expectations}</p>
          {selected.link ? (
            <p>
              Link to addtional resources:{' '}
              <a href={selected.link} target='_blank' rel='noreferrer'>
                {selected.link}
              </a>
            </p>
          ) : null}
          <div id='btn-container' className='flex space-between'>
            {days
              ? days.map((day) => (
                  // <button key={day.id} onClick={() => handleViewDay(day)}>{`View Day ${day.number}`}</button>
                  <div id='view-day-button' key={day.id}>
                    <h3
                      onClick={() => handleViewDay(day)}
                      id='view-day-title'
                    >{`View Day ${day.number}`}</h3>
                    <div id='view-day-description'>
                      <p
                        className='view-day-component-label'
                        style={{ marginTop: '0px' }}
                      >
                        <strong>TEKS:</strong> {day.TekS}
                      </p>
                      <p className='view-day-component-label'>
                        <strong>Description:</strong> {day.description}
                      </p>
                      <p className='view-day-component-label'>
                        <strong>Science Components: </strong>
                      </p>
                      <div>
                        {day.learning_components
                          .filter(
                            (component) =>
                              component.learning_component_type === SCIENCE
                          )
                          .map((element, index) => {
                            return (
                              <Tag
                                className='tag'
                                key={index}
                                color={color[(index + 1) % 11]}
                              >
                                {element.type}
                              </Tag>
                            );
                          })}
                      </div>
                      <p className='view-day-component-label'>
                        <strong>Making Components: </strong>
                      </p>
                      <div>
                        {day.learning_components
                          .filter(
                            (component) =>
                              component.learning_component_type === MAKING
                          )
                          .map((element, index) => {
                            return (
                              <Tag
                                className='tag'
                                key={index}
                                color={color[(index + 4) % 11]}
                              >
                                {element.type}
                              </Tag>
                            );
                          })}
                      </div>
                      <p className='view-day-component-label'>
                        <strong>Computation Components: </strong>
                      </p>
                      <div>
                        {day.learning_components
                          .filter(
                            (component) =>
                              component.learning_component_type === COMPUTATION
                          )
                          .map((element, index) => {
                            return (
                              <Tag
                                className='tag'
                                key={index}
                                color={color[(index + 7) % 11]}
                              >
                                {element.type}
                              </Tag>
                            );
                          })}
                      </div>
                      {day.link ? (
                        <p className='view-day-component-label'>
                          <strong>Link to Additional Information: </strong>
                          <a href={day.link} target='_blank' rel='noreferrer'>
                            {day.link}
                          </a>
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
