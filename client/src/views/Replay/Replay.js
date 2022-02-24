import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import './Replay.less'
import { Link, useParams } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Marker from './Marker';
import { Table } from 'antd';
import { getSave } from '../../Utils/requests';

const Replay = () => {
  const { saveID } = useParams();
  const workspaceRef = useRef(null);
  const [replay, setReplay] = useState([]);
  const [blocksData, setBlocksData ] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRef, setPlaybackRef] = useState(null);

  const reducer = (state, action) => {
    switch(action.type){
      case "Increment":
        return state + 1;
      case "Decrement":
        return state - 1;
      case "SetValue":
        return action.value;
      default:
        return state;
    }
  };

  const [step, dispatch] = useReducer(reducer, 0);


  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas',
        { 
          toolbox: document.getElementById('toolbox'),
          readOnly: true,
        }
    );
  }

  const timeConverter = (timestamp) => {
    var dateVal = new Date(timestamp).toLocaleDateString('en-US');
    var a = new Date(timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    // var time = dateVal + ' ' + hour + ':' + min + ':' + sec ;
    var time = hour + ':' + min + ':' + sec ;
    return time;
  };


  useEffect(() => {

    const getReplay = async () => {
      const save = await getSave(saveID);
      console.log(save.data.replay)
      setReplay(save.data.replay);
      
      // TODO: if xmlData does not exist, do not show table, else show table of blocks
      // SAVES Obj
      const saveObj = save.data.replay;
      console.log(saveObj);

      // If SAVES Obj does not contain key 'xmlData', do no show Table
      if (!('xmlData' in saveObj[0])) {
        console.log('HIDE TABLE');
      } 
      else{
        let blocksData = new Set();
        // Get blocks data
        saveObj.forEach((obj) => blocksData.add(obj.xmlData.blocks));
        setBlocksData(blocksData);

        // Convert Set to Array
        let blocksArr = [...blocksData];
        
        // How to parse 
        const blockName = blocksArr.map(block => block.key);
        const action = blocksArr.map(block => block.value);
        console.log(blocksArr);
        console.log(blockName);
        console.log(action);
        
        // const blockKeys = blocksData.map(obj => obj[0]);
        // console.log(blockKeys);

      }
    }

    getReplay();
    
  }, [])

  // const dataSource = [
  //   {
  //     key: timestamp,
  //     name: blockName,
  //     action: action,
  //   }
  // ];

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '3%',
      align: 'center',
      sorter: {
        compare: (a, b) => (a.last_logged_in < b.last_logged_in ? -1 : 1),
      }
    },
    {
      title: 'Blocks',
      dataIndex: 'blockName',
      key: 'blockName',
      width: '3%',
      align: 'center'
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '3%',
      align: 'center'
    }
  ];
  
  const goBack = () => {
    dispatch({type: "Decrement"});
  }
  
  
  const goForward = () => {
    dispatch({type: "Increment"});
  }
  
  const setStep = (value) => {
    dispatch({type: "SetValue", value: value});
  }

  const handlePlay = ()=>{
    goForward();
    setPlaybackRef(setInterval(()=>{
      goForward();
    }, 500));
    
    setIsPlaying(true);
  };
  
  const handlePause = useCallback(()=>{
    
    if (playbackRef) {
      clearInterval(playbackRef);
      setPlaybackRef(null);
    }
    setIsPlaying(false);

  }, [playbackRef]);
  
  //handle dynamic playback changes
  useEffect(() => {
    
    if (replay.length) {

      if (step === replay.length-1 && isPlaying)
        handlePause();

      workspaceRef.current ? workspaceRef.current.clear() : setWorkspace();
      const xml = window.Blockly.Xml.textToDom(replay[step].xml);
      window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
    }

  }, [replay, step, isPlaying, handlePause]);




  return (
    <main className="container nav-padding">
      <NavBar /> 
      <div id="horizontal-container" className="flex flex-column">
        <div id="top-container" className="flex flex-column vertical-container">
          <div id="description-container" className="flex flex-row space-between card">
            <div className="flex flex-row">
              <Link id="link" to="/" className="flex flex-column">
                <i className="fa fa-home"/>
              </Link>
            </div>
            <div className="flex flex-row">
              <button className="replayButton" onClick={goBack} disabled={step === 0}>&#9198;</button>
              <button className="replayButton" 
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={step === (replay.length - 1)}
              >
                {isPlaying ? <span>&#9208;</span> : <span>&#9654;&#65039;</span>}
              </button>
              <button className="replayButton" onClick={goForward} disabled={step === (replay.length - 1)}>&#9197;</button>
            </div>
          </div>
          <div id="timeline-container">
        <div id="timeline">
              { replay.map((item, index) => 
              <div className={step === index ? 'current-time' : 'all-times'} 
                key={item.timestamp}
                onClick={()=>setStep(index)}>
                {timeConverter(item.timestamp)}
                <Marker/>
              </div>)}
        </div>
      </div>
        </div>
        <div className='flex flex-row'>
          <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
            <h1 id="section-header">Code Replay</h1>
            <div id="blockly-canvas"/>
            {/* <div id="timeline">
              { replay.map((item, index) => <div className={step === index ? 'current-time' : 'all-times'} key={item.timestamp}>{timeConverter(item.timestamp)}<Marker/></div>)}
            </div> */}
          </div>
        </div>
        <div className='flex flex-row'>
          <section id='bottom-container' className="flex flex-column vertical-container overflow-visible">
            <h2 id="logs-title">Logs</h2>
            {/* <div id='logs'>
              { replay.map((item, index) => <p className={step === index ? 'bold' : null} key={item.timestamp}> {timeConverter(item.timestamp)} </p>)}
            </div> */}
            <Table
              columns={columns} 
              // dataSource={dataSource}
            />
          </section>
        </div>
      
      </div>
      <xml id="toolbox" is="Blockly workspace"></xml>
    </main>
  )
};

export default Replay;