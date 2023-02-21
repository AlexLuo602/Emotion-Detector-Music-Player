import { useEffect,useRef } from 'react';
import * as faceapi from "face-api.js"

const NewPost = () => {
  const imgRef = useRef()
  const canvasRef = useRef()

  const handleImage = async () => {
    const detections = await faceapi
    .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current);
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

    // useEffect calls the anonomys function, then renders the output
    useEffect(()=> {
        const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")
        ])
            .then(handleImage)
            .catch((e) => console.log(e));
        }

        imgRef.current && loadModels();
    },[])

    return (
    <div>NewPost</div>
    )
}

export default NewPost