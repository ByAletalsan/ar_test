const video = document.getElementById("myvideo");
const handimg = document.getElementById("handimage");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1;
let isVideo = false;
let model = null;

let x = 0;
let y = 0;

// video.width = 500
// video.height = 400

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 20, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6, // confidence threshold for predictions.
};

function startVideo() {
  handTrack.startVideo(video).then(function (status) {
    console.log("video started", status);
    if (status) {
      updateNote.innerText = "Video started. Now tracking";
      isVideo = true;
      runDetection();
    } else {
      updateNote.innerText = "Please enable video";
    }
  });
}

function toggleVideo() {
  if (!isVideo) {
    updateNote.innerText = "Starting video";
    startVideo();
  } else {
    updateNote.innerText = "Stopping video";
    handTrack.stopVideo(video);
    isVideo = false;
    updateNote.innerText = "Video stopped";
  }
}

trackButton.addEventListener("click", function () {
  toggleVideo();
});

function runDetection() {
  model.detect(video).then((predictions) => {
    //console.log("Predictions: ", predictions);
    try
    {
      //console.log(predictions[0].label);
      //console.log(model.getFPS());
      model.renderPredictions(predictions, canvas, context, video);
      if (predictions[0].label == 'open')
      {
        if (Math.sqrt(Math.pow((x - predictions[0].bbox[0]), 2) + Math.pow((y - predictions[0].bbox[1]), 2)) <= 50)
        {
          x = predictions[0].bbox[0];
          y = predictions[0].bbox[1];
        }
      }
      context.fillRect(x, y, 200, 200);
    }
    catch (error)
    {
      console.log("SKIP FRAME");
    }
    if (isVideo) {
      requestAnimationFrame(runDetection);
    }
  });
}

// Load the model.
handTrack.load(modelParams).then((lmodel) => {
  // detect objects in the image.
  model = lmodel;
  console.log(model);
  updateNote.innerText = "Loaded Model!";
  trackButton.disabled = false;
});
