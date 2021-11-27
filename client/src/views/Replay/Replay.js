import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar';

const Replay = () => {
  const workspaceRef = useRef(null);
  const [step, setStep] = useState(0);
  let playback;
  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas',
        { toolbox: document.getElementById('toolbox') }
    );
  }
  const replay = [
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"12\" y=\"3\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block></xml>",
      "timestamp": 1618859201398
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block></xml>",
      "timestamp": 1618859202401
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block><block type=\"logic_operation\" id=\"kcE(=RH;B2%jPFhNjyDK\" x=\"85\" y=\"289\"><field name=\"OP\">AND</field></block></xml>",
      "timestamp": 1618859203397
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block><block type=\"logic_operation\" id=\"kcE(=RH;B2%jPFhNjyDK\" x=\"146\" y=\"267\"><field name=\"OP\">AND</field></block></xml>",
      "timestamp": 1618859204397
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block><block type=\"math_single\" id=\"hVMn@TndjNGID0Wv5wyf\" x=\"162\" y=\"213\"><field name=\"OP\">ROOT</field></block><block type=\"logic_operation\" id=\"kcE(=RH;B2%jPFhNjyDK\" x=\"146\" y=\"267\"><field name=\"OP\">AND</field></block></xml>",
      "timestamp": 1618859206397
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block><block type=\"math_single\" id=\"hVMn@TndjNGID0Wv5wyf\" x=\"35\" y=\"267\"><field name=\"OP\">ROOT</field><value name=\"NUM\"><block type=\"logic_operation\" id=\"kcE(=RH;B2%jPFhNjyDK\"><field name=\"OP\">AND</field></block></value></block></xml>",
      "timestamp": 1618859209397
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block><block type=\"controls_whileUntil\" id=\",Etk-r,BQ][E9nQd^?VO\" x=\"368\" y=\"155\"><field name=\"MODE\">WHILE</field></block><block type=\"math_single\" id=\"hVMn@TndjNGID0Wv5wyf\" x=\"35\" y=\"267\"><field name=\"OP\">ROOT</field><value name=\"NUM\"><block type=\"logic_operation\" id=\"kcE(=RH;B2%jPFhNjyDK\"><field name=\"OP\">AND</field></block></value></block></xml>",
      "timestamp": 1618859211400
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block><block type=\"math_single\" id=\"hVMn@TndjNGID0Wv5wyf\" x=\"35\" y=\"267\"><field name=\"OP\">ROOT</field><value name=\"NUM\"><block type=\"logic_operation\" id=\"kcE(=RH;B2%jPFhNjyDK\"><field name=\"OP\">AND</field></block></value></block><block type=\"controls_whileUntil\" id=\",Etk-r,BQ][E9nQd^?VO\" x=\"476\" y=\"355\"><field name=\"MODE\">WHILE</field></block></xml>",
      "timestamp": 1618859214404
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"controls_whileUntil\" id=\"j^FJ6%E)J2vb*o35fJ(R\" x=\"93\" y=\"53\"><field name=\"MODE\">WHILE</field></block><block type=\"controls_if\" id=\"+tDwx%uD*;|/%MoHiBuD\" x=\"72\" y=\"141\"><value name=\"IF0\"><block type=\"variables_get\" id=\"iQ,uNAfjOn;[Fhd|~lzS\"><field name=\"VAR\">item</field></block></value></block><block type=\"math_single\" id=\"hVMn@TndjNGID0Wv5wyf\" x=\"35\" y=\"267\"><field name=\"OP\">ROOT</field><value name=\"NUM\"><block type=\"logic_operation\" id=\"kcE(=RH;B2%jPFhNjyDK\"><field name=\"OP\">AND</field></block></value></block></xml>",
      "timestamp": 1618859216400
    }
  ];
  useEffect(() => {
    workspaceRef.current ? workspaceRef.current.clear() : setWorkspace();
    const xml = window.Blockly.Xml.textToDom(replay[step].xml);
    window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
  }, [step]);

  const goBack = () => {
    setStep(step - 1);
  }
  // const play = () => {
  //   playback = setInterval(() => {
  //     console.log('firing');
  //     setStep(step + 1);
  //     console.log(step);
  //   }, 1000);
  // }
  const goForward = () => {
    setStep(step + 1);
  }
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
              <button className="replayButton" disabled={playback}>&#9654;&#65039;</button>
              <button className="replayButton" onClick={goForward} disabled={step === (replay.length - 1)}>&#9197;</button>
            </div>
          </div>
        </div>
        <div className='flex flex-row'>
          <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
            <h1 id="section-header">Code Replay</h1>
            <div id="blockly-canvas"/>
          </div>
        </div>
        <div className='flex flex-row'>
          <section id='bottom-container' className="flex flex-column vertical-container overflow-visible">
            <h2 id="section-header">Logs</h2>
            <div>
              { replay.map((item, index) => <p className={step === index ? 'bold' : null} key={item.timestamp}>{item.timestamp}</p>)}
            </div>
          </section>
        </div>
      </div>
      <xml id="toolbox" is="Blockly workspace"></xml>
    </main>
  )
};

export default Replay;