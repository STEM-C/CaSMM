import React, { useState, useEffect } from "react";
import { ReactMediaRecorder, useReactMediaRecorder } from "react-media-recorder";
import { addVideo } from "./Utils/requests";

const ScreenRecorder = ({ onRecordingComplete }) => {
  const {
    startRecording,
    stopRecording,
    mediaBlobUrl,
    previewStream,
  } = useReactMediaRecorder({ screen: true });
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const [refresh, setRefresh] = useState(true);

  // Stop recording and upload on page unload
  const handleBeforeUnload = (event) => {
      stopRecording();
      setTimeout(()=>{},3000)
      // Prevent the browser from closing immediately
      event.preventDefault();
      event.returnValue = '';

      // Stop the recording and upload the blob


      // Fetch the blob from the mediaBlobUrl and upload it
      fetch(mediaBlobUrl)
        .then((res) => res.blob())
        .then((blob) => {
          uploadRecording(blob);  // Upload the blob
        });
    
    console.log('hi')
  };
  
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, );

  const uploadVideo = async (blob) => {
    const formData = new FormData();
    formData.append('files', blob, 'screen-recording.mp4');
  
    try {
      const response = await fetch('http://localhost:1337/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();

      console.log('Video uploaded successfully:', data);

      addVideo(parseInt(localStorage.studentID), data[0]);
    } catch (error) {
      console.error('Error uploading the video:', error);
    }
  };

  return (
    <div>
      <ReactMediaRecorder
        screen
        video
        onStop={(blobUrl, blob) => {
            setVideoBlobUrl(blobUrl);
            uploadVideo(blob); // Upload video after stopping the recording
        }}
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>Status: {status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>

          </div>
        )}
      />

    </div>
  );
};

export default ScreenRecorder;
