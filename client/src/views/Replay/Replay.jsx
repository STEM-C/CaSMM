import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { Slider, Col, Row } from 'antd';
import './Replay.less';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import { Table } from 'antd';
import { getSave } from '../../Utils/requests';
import { CSVDownloader } from 'react-papaparse';
const TIME_LINE_SIZE = 25;

const timelineReducer = (timeline, action) => {
  const checkTimelineStepInBound = () => {
    if (timeline.step >= timeline.endIndex) {
      let newEnd = Math.min(timeline.length, timeline.step + 7);
      timeline.endIndex = newEnd;
      timeline.startIndex = newEnd - TIME_LINE_SIZE;
    } else if (timeline.step < timeline.startIndex) {
      let newStart = Math.max(0, timeline.step - 6);
      timeline.startIndex = newStart;
      timeline.endIndex = newStart + TIME_LINE_SIZE;
    }
  };

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
      checkTimelineStepInBound();
      return { ...timeline };

    case 'IncrementTimeline':
      if (timeline.endIndex <= timeline.length) {
        timeline.startIndex += 5;
        timeline.endIndex = Math.min(timeline.endIndex + 5, timeline.length);
      }
      return { ...timeline };

    case 'DecrementTimeline':
      if (timeline.startIndex >= 0) {
        timeline.startIndex = Math.max(timeline.startIndex - 5, 0);
        timeline.endIndex -= 5;
      }
      return { ...timeline };

    case 'FetchReplayLength':
      timeline.length = action.value;
      return { ...timeline };

    default:
      return timeline;
  }
};

const Replay = () => {
  const { saveID } = useParams();
  const workspaceRef = useRef(null);
  const [replay, setReplay] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRef, setPlaybackRef] = useState(null);
  const [playSpeed, setPlaySpeed] = useState(500);
  const navigate = useNavigate();
  const [action, setAction] = useState('');
  const [logData, setLogData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvFilename, setCsvFilename] = useState('code_replay');
  const [actionFilter, setActionFilter] = useState([]);
  const [blockTypeFilter, setBlockTypeFilter] = useState([]);
  const [blockIdFilter, setBlockIdFilter] = useState([]);

  const [timelineStates, dispatchTimelineReducer] = useReducer(
    timelineReducer,
    {
      step: 0,
      startIndex: 0,
      endIndex: TIME_LINE_SIZE,
      length: 0,
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

  const makeFilter = (data, category) => {
    let filter = [];
    const map = new Map();

    data.forEach((element) => {
      const name = element[category];
      if (name && !map.has(name)) {
        filter.push({ text: name, value: name });
        map.set(name, true);
      }
    });
    return filter;
  };

  useEffect(() => {
    const getReplay = async () => {
      const save = await getSave(saveID);
      setReplay(save.data.replay);

      dispatchTimelineReducer({
        type: 'FetchReplayLength',
        value: save.data.replay ? save.data.replay.length : 0,
      });
      //set log
      let data = save.data.replay.map((item, index) => {
        return {
          key: index,
          blockId: item.blockId,
          blockType: item.blockType,
          timestamp: item.timestamp,
          action: item.action,
        };
      });

      setLogData(data);
      setCsvData(data.slice(0).reverse());
      setCsvFilename(
        `${save.data.student.name}_${save.data.created_at}_code_replay`
      );

      setActionFilter(makeFilter(data, 'action'));
      setBlockTypeFilter(makeFilter(data, 'blockType'));
      setBlockIdFilter(makeFilter(data, 'blockId'));
    };
    getReplay();
  }, []);

  const columns = [
    {
      title: 'No.',
      dataIndex: 'key',
      key: 'key',
      width: '3%',
      align: 'center',
      render: (key) => key + 1,
    },
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
      render: (timestamp) => formatMyDate(timestamp),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '3%',
      align: 'center',
      filters: actionFilter,
      onFilter: (value, record) => record.action === value,
    },
    {
      title: 'Block Type',
      dataIndex: 'blockType',
      key: 'blockType',
      width: '3%',
      align: 'center',
      filters: blockTypeFilter,
      onFilter: (value, record) => record.blockType === value,
    },
    {
      title: 'Block ID',
      dataIndex: 'blockId',
      key: 'blockId',
      width: '3%',
      align: 'center',
      filters: blockIdFilter,
      onFilter: (value, record) => record.blockId === value,
    },
  ];

  const goBack = () => {
    dispatchTimelineReducer({ type: 'DecrementStep' });
  };

  const goForward = () => {
    dispatchTimelineReducer({ type: 'IncrementStep' });
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
      if (replay[timelineStates.step].blockId)
        window.Blockly.mainWorkspace
          .getBlockById(replay[timelineStates.step].blockId)
          ?.select();
      setAction(replay[timelineStates.step].action);
    }
  }, [replay, timelineStates, isPlaying, handlePause]);

  const changePlaySpeed = (value) => {
    setPlaySpeed(value);
  };

  const scrollTimelineForward = () => {
    dispatchTimelineReducer({ type: 'IncrementTimeline' });
  };

  const scrollTimelineBackward = () => {
    dispatchTimelineReducer({ type: 'DecrementTimeline' });
  };

  const handleGoBack = () => {
    if (window.confirm('Comfirm going back')) navigate(-1);
  };

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
                  tooltipVisible={false}
                />
                &#128007;
              </div>
              <button
                className='replayButton'
                onClick={goBack}
                disabled={timelineStates.step <= 0}
              >
                &#9198;
              </button>
              <button
                className='replayButton'
                onClick={isPlaying ? handlePause : handlePlay}
                disabled={timelineStates.step >= replay.length - 1}
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
                disabled={timelineStates.step >= replay.length - 1}
              >
                &#9197;
              </button>
            </div>
          </div>
          <div id='timeline-container'>
            <button
              disabled={timelineStates.startIndex <= 0}
              onClick={scrollTimelineBackward}
            >
              {' '}
              &#8249;{' '}
            </button>
            <div id='timeline'>
              {replay
                .map((item, index) => (
                  <div
                    className={
                      timelineStates.step === index
                        ? 'current-time'
                        : 'all-times'
                    }
                    key={item.timestamp}
                    onClick={() => setStep(index)}
                  >
                    {formatMyDate(item.timestamp)}
                  </div>
                ))
                .slice(timelineStates.startIndex, timelineStates.endIndex)}
            </div>
            <button
              disabled={timelineStates.endIndex >= replay.length}
              onClick={scrollTimelineForward}
            >
              &#8250;
            </button>
          </div>
        </div>

        <div className='flex flex-row'>
          <div
            id='bottom-container'
            className='flex flex-column vertical-container overflow-visible'
          >
            <Row id='icon-control-panel'>
              <Col flex='none' id='section-header'>
                Code Replay
              </Col>
              <Col flex='auto' id='action-title'>
                {`[${timelineStates.step + 1}/${
                  replay.length
                }] Action: ${action}`}
                {replay[timelineStates.step]?.blockType !== '' && (
                  <>{`, Block Type: ${
                    replay[timelineStates.step]?.blockType
                  }`}</>
                )}
              </Col>
            </Row>
            <div id='blockly-canvas' />
          </div>
        </div>
        <div className='flex flex-row'>
          <section
            id='bottom-container'
            className='flex flex-column vertical-container overflow-visible'
          >
            <div className='flex flex-row space-between'>
              <h2 id='logs-title'>Logs</h2>
              <CSVDownloader
                filename={csvFilename}
                type={'button'}
                bom={true}
                data={() => {
                  return csvData.map((log) => {
                    return {
                      'No.': log.key + 1,
                      timestamp: formatMyDate(log.timestamp),
                      action: log.action,
                      'block type': log.blockType,
                      'block id': log.blockId,
                    };
                  });
                }}
              >
                Download to CSV
              </CSVDownloader>
            </div>

            <Table
              id='replay-log'
              rowClassName={(record, index) =>
                'table-row ' +
                (record.key === timelineStates.step
                  ? 'table-row-dark'
                  : 'table-row-light')
              }
              onRow={(record, index) => {
                return {
                  onClick: () => setStep(record.key),
                };
              }}
              scroll={{ y: 300 }}
              pagination={false}
              columns={columns}
              dataSource={logData}
              onChange={(pagination, filter, sorter, extra) => {
                setCsvData(extra.currentDataSource);
              }}
            />
          </section>
        </div>
      </div>
      <xml id='toolbox' is='Blockly workspace'></xml>
    </main>
  );
};

export default Replay;
