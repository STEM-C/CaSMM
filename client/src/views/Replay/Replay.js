import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Slider } from 'antd';
import './Replay.less';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { Table } from 'antd';
import { getSave } from '../../Utils/requests';

const Replay = () => {
  const TIME_LINE_SIZE = 25;
  const { saveID } = useParams();
  const workspaceRef = useRef(null);
  const [replay, setReplay] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(TIME_LINE_SIZE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRef, setPlaybackRef] = useState(null);
  const [playSpeed, setPlaySpeed] = useState(500);
  const navigate = useNavigate();
  const [action, setAction] = useState('');
  const [logData, setLogData] = useState([]);

    switch (action.type) {
      case 'IncrementStep':
        timeline.step += 1;
        checkTimelineStepInBound();
        return { ...timeline };

      case 'DecrementStep':
        timeline.step -= 1;
        checkTimelineStepInBound();
        return { ...timeline };

      case 'SetStepValue':
        timeline.step = action.value;
        return { ...timeline };

      case 'IncrementTimeline':
        if (timeline.endIndex <= replay.length) {
          timeline.startIndex += 5;
          timeline.endIndex = Math.min(timeline.endIndex + 5, replay.length);
        }
        return { ...timeline };

      case 'DecrementTimeline':
        if (timeline.startIndex >= 0) {
          timeline.startIndex = Math.max(timeline.startIndex - 5, 0);
          timeline.endIndex -= 5;
        }
        return { ...timeline };

      default:
        return timeline;
    }
  };

  const [timelineStates, dispatchTimelineReducer] = useReducer(
    timelineReducer,
    {
      step: 0,
      startIndex: 0,
      endIndex: TIME_LINE_SIZE,
    }
  );

  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas', {
      toolbox: document.getElementById('toolbox'),
      readOnly: true,
    });
  };

  const formatMyDate = (timestamp, locale = 'en-GB') => {
    return new Date(timestamp).toLocaleTimeString(locale);
  };

  useEffect(() => {
    const getReplay = async () => {
      const save = await getSave(saveID);
      console.log(save.data.replay);
      setReplay(save.data.replay);
    };
    getReplay();
  }, []);

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '3%',
      align: 'center',
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a, b) => (a < b ? -1 : 1),
      },
      render: (timestamp) => formatMyDate(timestamp)
    },
    {
      title: 'Block ID',
      dataIndex: 'blockId',
      key: 'blockId',
      width: '3%',
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '3%',
      align: 'center',
    },
  ];

  const goBack = () => {
    dispatch({ type: 'Decrement' });
    
    if(step < startIndex){
      let newStart = Math.max(0, step-5);
      setStartIndex(newStart);
      setEndIndex(newStart + TIME_LINE_SIZE);
    }

  };

  const goForward = () => {
    dispatch({ type: 'Increment' });
  
    if(step >= endIndex){
      let newEnd = Math.min(replay.length, step+5);
      setEndIndex(newEnd);
      setStartIndex(newEnd-TIME_LINE_SIZE);
    }

  };

  const setStep = (value) => {
    dispatchTimelineReducer({ type: 'SetStepValue', value: value });
  };

  const handlePlay = () => {
    setPlaybackRef(
      setInterval(() => {
        goForward();
      }, playSpeed)
    );

    setIsPlaying(true);
  };

  const handlePause = useCallback(() => {
    if (playbackRef) {
      clearInterval(playbackRef);
      setPlaybackRef(null);
    }
    setIsPlaying(false);
  }, [playbackRef]);

  //handle dynamic playback changes
  useEffect(() => {
    if (replay.length) {
      if (timelineStates.step >= replay.length - 1 && isPlaying) handlePause();

      workspaceRef.current ? workspaceRef.current.clear() : setWorkspace();
      const xml = window.Blockly.Xml.textToDom(replay[timelineStates.step].xml);
      window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
      setAction(replay[step].action);
      
      //update log
      let data = replay.slice(0, step+1).map((item, index) => 
      {return {
        key: index,
        blockId: item.blockId,
        timestamp: item.timestamp,
        action: item.action
      }});
    
      setLogData(data);
    }
  }, [replay, timelineStates, isPlaying, handlePause]);

  const changePlaySpeed = (value) => {
    setPlaySpeed(value);
  };

  const scrollTimelineForward = () => {
    if(endIndex < replay.length){
      setStartIndex(startIndex + 5);
      setEndIndex(Math.min(endIndex + 5, replay.length));
    }
  }

  const scrollTimelineBackward = () => {
    if(startIndex > 0){
      setStartIndex(Math.max(startIndex - 5, 0));
      setEndIndex(endIndex - 5);
    }
  }

  return (
    <main className='container nav-padding'>
      <NavBar />
      <div id='horizontal-container' className='flex flex-column'>
        <div id='top-container' className='flex flex-column vertical-container'>
          <div
            id='description-container'
            className='flex flex-row space-between card'
          >
            <div className='flex flex-row'>
              <button
                onClick={handleGoBack}
                id='link'
                className='flex flex-column'
              >
                <i id='icon-btn' className='fa fa-arrow-left' />
              </button>
            </div>
            <div className='flex flex-row'>
              <div className='flex flex-row'>
                &#128034;
                <Slider
                  className='playspeed-slider'
                  defaultValue={playSpeed}
                  max={1000}
                  min={50}
                  step={50}
                  onAfterChange={changePlaySpeed}
                  disabled={isPlaying}
                  reverse={true}
                />
                &#128007;
              </div>
              <button
                className='replayButton'
                onClick={goBack}
                disabled={timelineStates.step === 0}
              >
                &#9198;
              </button>
              <button
                className='replayButton'
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={timelineStates.step === replay.length - 1}
              >
                {isPlaying ? (
                  <span>&#9208;</span>
                ) : (
                  <span>&#9654;&#65039;</span>
                )}
              </button>
              <button
                className='replayButton'
                onClick={goForward}
                disabled={timelineStates.step === replay.length - 1}
              >
                &#9197;
              </button>
            </div>
          </div>
          <div id='timeline-container'>
            <button
              disabled={startIndex <= 0}
              onClick={scrollTimelineBackward}
              > &#8249; </button>
            <div id='timeline'>
              {replay.map((item, index) => (
                <div
                  className={step === index ? 'current-time' : 'all-times'}
                  key={item.timestamp}
                  onClick={() => setStep(index)}
                >
                  {formatMyDate(item.timestamp)}
                </div>
              )).slice(startIndex, endIndex)}
            </div>
            <button
            disabled={endIndex >= replay.length}
            onClick={scrollTimelineForward}
            >&#8250;</button>
          </div>
        </div>
        <h2 id="action-title">{`Action ${step+1}/${replay.length}: ${action}`}</h2>

        <div className='flex flex-row'>
          <div
            id='bottom-container'
            className='flex flex-column vertical-container overflow-visible'
          >
            <h1 id='section-header'>Code Replay</h1>
            <div id='blockly-canvas' />
            {/* <div id="timeline">
              { replay.map((item, index) => <div className={step === index ? 'current-time' : 'all-times'} key={item.timestamp}>{timeConverter(item.timestamp)}<Marker/></div>)}
            </div> */}
          </div>
        </div>
        <div className='flex flex-row'>
          <section
            id='bottom-container'
            className='flex flex-column vertical-container overflow-visible'
          >
            <h2 id='logs-title'>Logs</h2>
            <Table
              size='small'
              columns={columns}
              dataSource={logData}
            />
          </section>
        </div>
      </div>
      <xml id='toolbox' is='Blockly workspace'></xml>
    </main>
  );
};

export default Replay;
