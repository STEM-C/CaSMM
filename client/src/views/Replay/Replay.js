import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Slider } from 'antd';
import './Replay.less';
import { Link, useParams } from 'react-router-dom';
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
  const [action, setAction] = useState('');
  const [logData, setLogData] = useState([]);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'Increment':
        return state + 1;
      case 'Decrement':
        return state - 1;
      case 'SetValue':
        return action.value;
      default:
        return state;
    }
  };

  const [step, dispatch] = useReducer(reducer, 0);

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
    
    if(step < startIndex + 1){
      let newStart = Math.max(0, step-6);
      setStartIndex(newStart);
      setEndIndex(newStart + TIME_LINE_SIZE);
    }

  };

  const goForward = () => {
    dispatch({ type: 'Increment' });
  
    if(step >= endIndex - 1){
      let newEnd = Math.min(replay.length, step+7);
      setEndIndex(newEnd);
      setStartIndex(newEnd-TIME_LINE_SIZE);
    }

  };

  const setStep = (value) => {
    dispatch({ type: 'SetValue', value: value });
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
      if (step === replay.length - 1 && isPlaying) handlePause();

      workspaceRef.current ? workspaceRef.current.clear() : setWorkspace();
      const xml = window.Blockly.Xml.textToDom(replay[step].xml);
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
  }, [replay, step, isPlaying, handlePause]);

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
              <Link id='link' to='/' className='flex flex-column'>
                <i className='fa fa-home' />
              </Link>
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
                disabled={step === 0}
              >
                &#9198;
              </button>
              <button
                className='replayButton'
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={step === replay.length - 1}
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
                disabled={step === replay.length - 1}
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
                  <div className='marker' />
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
              scroll={{y:300}}
              pagination={false}
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
