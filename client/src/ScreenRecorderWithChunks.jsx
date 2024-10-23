import React, { useEffect, useState } from 'react';
import { addVideo } from './Utils/requests';
import { server } from './Utils/hosts';

const ScreenRecorderWithChunks = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null); // Store the stream
  const [isRefresh, setIsRefresh] = useState(true);
  const [autoStop, setAutoStop] = useState(false);
  let autostopping = false;
  const ogTime = Date.now()
  let lastTime = ogTime
  let timeDiff = 0
  const [timerd , setTimerD] = useState(0)

  // Function to start the screen recording
  const startRecording = async () => {
    try {
      if (!stream) {
        // Request screen access only once
        const newStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setStream(newStream);

        const recorder = new MediaRecorder(newStream, {videoBitsPerSecond:2000});
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordingChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };
        recorder.onstop = () => {
          setIsRecording(false)
          localStorage.isRecording = 'false'
        }
        // Start the recorder
        recorder.start();
        setMediaRecorder(recorder);
      } else {
        // Restart recording using the existing stream
        mediaRecorder.start();
      }
      setIsRecording(true);
      localStorage.isRecording = 'true';
    } catch (error) {
      console.error("Error accessing screen recording:", error);
      window.location.reload();
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder) {
      autostopping = true;
      mediaRecorder.stop();
      setIsRecording(false);
      localStorage.isRecording ='false';
    }

  };

  // Function to upload the blob to Strapi
  const uploadToStrapi = async (blob) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    const formData = new FormData();
    //console.log(blob)

    //console.log(formattedDate);
    formData.append('files', blob, `${localStorage.studentName} at ${formattedDate}.mp4`);
    //console.log(formData)

    try {
      const response = await fetch(`${server}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      //console.log("Upload successful:", result);
      addVideo(parseInt(localStorage.studentID), result[0]);
    } catch (error) {
      console.error("Error uploading the recording:", error);
    }
  };




  // Use Effect to handle chunk uploads every minute



  useEffect(() => {
    //console.log(isRecording)
    if (recordingChunks.length > 0) {
      const lastChunk = recordingChunks.pop();
      //console.log(lastChunk)
      uploadToStrapi(lastChunk);
    }
  }, [recordingChunks]);
  useEffect(() => {
    if (isRefresh) {
      startRecording();
      setIsRefresh(false)
    }
  }, [isRefresh])

  // Set an interval to stop the recording every 60 seconds
  useEffect(() => {
    let intervalId;
    if (isRecording) {
      intervalId = setInterval(() => {
        stopRecording(); // Stop the current recording
        localStorage.isRecording = 'true'
        autostopping = false;
        setTimeout(() => {
          startRecording(); // Restart recording after a short delay
        }, 1000); // Delay to ensure the previous recording is processed
      }, 60000); // 60 seconds
    }


    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [isRecording]);
  useEffect(() => {
    setTimeout(() => {
      setTimerD(parseInt(timerd) + 1)

      //console.log('howdy')
      //console.log(isRecording)
      if (localStorage.isRecording == 'false' && timerd != 0) {
        console.log('false')
        window.location.reload()
      }
    }, 10000)
  }, [timerd])
  return (
    <div></div>
  );
};

export default ScreenRecorderWithChunks
