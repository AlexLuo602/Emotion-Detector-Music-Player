import { useEffect,useRef } from 'react';
import * as faceapi from "face-api.js"
import './App.css';


function App() {
  // initialize the reference hooks to keep track of dom elements
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // handle image function using faceApi for real time face and emotion detection
  const handleImage = async () => {
    const detections = await faceapi
    .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    });

    const resized = faceapi.resizeResults(detections,{
      width: 940,
      height: 650,
    });
    faceapi.draw.drawDetections(canvasRef.current, resized);
    faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  };
  
  // start the webcam and set it to the video element
  useEffect(() => {
    const startVideo = async() => {
      let stream = null;
    
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { width: 940, height: 650 }
        });
        videoRef.current.srcObject=stream;
      } catch (err) {
        console.log(err);
      }
    }
    startVideo(); 
  },[])

  // initialize the FaceApi, give it initial data to feed, then call handleImage
  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models")
      ])
        .then(setInterval(handleImage))
        .catch((e) => console.log(e));
    }
    loadModels();
  },[])



  return (
    <div className="App">
      <video ref={videoRef} id="video" width="940" height="650" autoPlay muted></video>
      <canvas ref={canvasRef} width="940" height="650" />
    </div>
  );
}

export default App;
