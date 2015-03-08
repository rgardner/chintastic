window.onload = function() {
  StartBackground();
};

// Timer global variables.
var count;
var timer;

// Video global variables.
var oggSupported = false;
var webmSupported = false;
var mp4Supported = false;
var isPlaying = false;
var videoExt = "";
var isBackgroundVideo = true;

/**
 * Draws animation frame based on browser.
 */
function draw() {
  if (window.requestAnimationFrame) window.requestAnimationFrame(draw);
  // IE implementation
  else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(draw);
  // Firefox implementation
  else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(draw);
  // Chrome implementation
  else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(draw);
  // Other browsers that do not yet support feature
  else setTimeout(draw, 16.7);
  DrawVideoOnCanvas();
}

/**
 * Start countdown timer.
 */
function handleTimer() {
  if (count === 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML = "Recording";
    play();
  } else {
    var text = "Starting in " + count + "...";
    document.getElementById("countdown").innerHTML = text;
    count--;
  }
}

/**
 * Start the photo booth.
 */
function Start() {
  // Remove start button.
  var boothStartBtn = document.getElementById("boothStart");
  if (boothStart.parentNode) {
    boothStart.parentNode.removeChild(boothStart);
  }

  // Hide background preview and stop audio.
  document.getElementById("backgroundvideo").style.display = "none";
  document.getElementById("audio1").pause();

  // Start timer.
  count = 3;
  timer = setInterval(function() { handleTimer(count); }, 1000);
}

/**
 * Start recording video.
 */
function play() {
  document.getElementById("videodata").play();
  document.getElementById("videoBackgrounddata").play();
  document.getElementById("audio1").currentTime = 0;
  document.getElementById("audio1").play();
  isPlaying = true;
  draw();
}

/**
 * Apply green screen effects to canvas.
 */
function DrawVideoOnCanvas() {
  var object = document.getElementById("videodata");

  var backgroundObject;
  if (isBackgroundVideo) {
    backgroundObject = document.getElementById("videoBackgrounddata");
  } else {
    backgroundObject = document.getElementById("imageBackgrounddata");
  }
  var width = object.width;
  var height = object.height;
  var canvas = document.getElementById("videoscreen");
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  if (canvas.getContext) {
    var context = canvas.getContext('2d');
    context.drawImage(backgroundObject, 0, 0, width, height);
    var imgBackgroundData = context.getImageData(0, 0, width, height);
    context.drawImage(object, 0, 0, width, height);
    imgDataNormal = context.getImageData(0, 0, width, height);
    var imgData = context.createImageData(width, height);

    var r;
    var g;
    var b;
    var a;
    for (i = 0; i < imgData.width * imgData.height * 4; i += 4) {
      r = imgDataNormal.data[i + 0];
      g = imgDataNormal.data[i + 1];
      b = imgDataNormal.data[i + 2];
      a = imgDataNormal.data[i + 3];
      // compare rgb levels for green and set alphachannel to 0;
      selectedR = 50;
      selectedG = 150;
      selectedB = 150;
      if (r <= selectedR && b <= selectedB && g >= selectedG) {
          a = 0;
      }
      if (a !== 0) {
          imgData.data[i + 0] = r;
          imgData.data[i + 1] = g;
          imgData.data[i + 2] = b;
          imgData.data[i + 3] = a;
      }
    }

    for (var y = 0; y < imgData.height; y++) {
      for (var x = 0; x < imgData.width; x++) {
          r = imgData.data[((imgData.width * y) + x) * 4];
          g = imgData.data[((imgData.width * y) + x) * 4 + 1];
          b = imgData.data[((imgData.width * y) + x) * 4 + 2];
          a = imgData.data[((imgData.width * y) + x) * 4 + 3];
          if (imgData.data[((imgData.width * y) + x) * 4 + 3] !== 0) {
              offsetYup = y - 1;
              offsetYdown = y + 1;
              offsetXleft = x - 1;
              offsetxRight = x + 1;
              var change=false;
              if (offsetYup>0) {
                if (imgData.data[((imgData.width * (y-1) ) + (x)) * 4 + 3] === 0) {
                    change=true;
                }
              }
              if (offsetYdown < imgData.height) {
                if (imgData.data[((imgData.width * (y + 1)) + (x)) * 4 + 3] === 0) {
                  change = true;
                }
              }
              if (offsetXleft > -1) {
                if (imgData.data[((imgData.width * y) + (x -1)) * 4 + 3] === 0) {
                  change = true;
                }
              }
              if (offsetxRight < imgData.width) {
                if (imgData.data[((imgData.width * y) + (x + 1)) * 4 + 3] === 0) {
                  change = true;
                }
              }
              if (change) {
                  var gray = (imgData.data[((imgData.width * y) + x) * 4 + 0] * 0.393) + (imgData.data[((imgData.width * y) + x) * 4 + 1] * 0.769) + (imgData.data[((imgData.width * y) + x) * 4 + 2] * 0.189);
                  imgData.data[((imgData.width * y) + x) * 4] = (gray * 0.2) + (imgBackgroundData.data[((imgData.width * y) + x) * 4] *0.9);
                  imgData.data[((imgData.width * y) + x) * 4 + 1] = (gray * 0.2) + (imgBackgroundData.data[((imgData.width * y) + x) * 4 + 1]*0.9);
                  imgData.data[((imgData.width * y) + x) * 4 + 2] = (gray * 0.2) + (imgBackgroundData.data[((imgData.width * y) + x) * 4 + 2] * 0.9);
                  imgData.data[((imgData.width * y) + x) * 4 + 3] = 255;
              }
          }

      }
    }

    for (i = 0; i < imgData.width * imgData.height * 4; i += 4) {
      r = imgData.data[i + 0];
      g = imgData.data[i + 1];
      b = imgData.data[i + 2];
      a = imgData.data[i + 3];
      if (a === 0) {
        imgData.data[i + 0] = imgBackgroundData.data[i + 0];
        imgData.data[i + 1] = imgBackgroundData.data[i + 1];
        imgData.data[i + 2] = imgBackgroundData.data[i + 2];
        imgData.data[i + 3] = imgBackgroundData.data[i + 3];
      }
    }
    context.putImageData(imgData, 0, 0);
  }
}

/**
 * Determine supported video formats.
 */
function SupportedVideoFormat() {
  var video = document.createElement("video");
  if (video.canPlayType('video/ogg; codecs="theora, vorbis"')) {
    oggSupported = true;
  }
  if (video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"')) {
    mp4Supported = true;
  }
  if (video.canPlayType('video/webm; codecs="vp8, vorbis"')) {
    webmSupported = true;
  }
}

/**
 * Start background video.
 */
function StartBackground() {
  SupportedVideoFormat();
  if (oggSupported) videoExt = ".ogv";
  if (webmSupported) videoExt = ".webm";
  if (mp4Supported) videoExt = ".mp4";
  loadBackgroundVideo();
}

/**
 * Load background videos into dom.
 */
function loadBackgroundVideo() {
  var value = "";
  var radioObj = document.getElementsByName("background");
  if (!radioObj) return "";
  var radioLength = radioObj.length;
  if (radioLength === undefined) {
    if (radioObj.checked) {
      value = radioObj.value;
    } else {
      value= "";
    }
  }
  for (var i = 0; i < radioLength; i++) {
    if (radioObj[i].checked) {
      value = radioObj[i].value;
    }
  }

  var backgroundType= value.split("/");
  if (backgroundType[0] == "videos") {
    isBackgroundVideo = true;
    var bgVideo = document.getElementById("videoBackgrounddata");
    bgVideo.src = value + videoExt;
    bgVideo.loop = true;
    document.getElementById("videoBackgrounddata").play();
  } else {
    isBackgroundVideo = false;
    document.getElementById("backgroundvideo").style.display = "none";
    document.getElementById("imageBackgrounddata").src = value;
  }
}
/***** SONG STUFF **/
/***** SONG STUFF **/
/***** SONG STUFF **/
var songList = new Array();
songList[0] = [
                "audio/callmemaybe.ogg"
                ];
songList[1] = [
                "audio/lazysong.ogg"
                ];
songList[2] = [
                "audio/single_ladies.ogg"
             ];
songList[3] = [
                "audio/sweet_escape.ogg"
                ];

function selectSong() {
  var audio = document.getElementById("audio1");
  if (document.getElementById('s1').checked) {
    audio.src = "audio/callmemaybe.ogg";
  } else if (document.getElementById('s2').checked) {
    audio.src = "audio/lazysong.ogg";
  } else if (document.getElementById('s3').checked) {
    audio.src = "audio/single_ladies.ogg";
  } else if (document.getElementById('s4').checked) {
    audio.src = "audio/sweet_escape.ogg";
  }
  audio.play();
}
