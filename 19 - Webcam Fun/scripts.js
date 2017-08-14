const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch( err => {
      console.log(err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    //mess with them
    pixels = rbgSplit(pixels);
    // add ghosting effect
    ctx.globalAlpha = 0.4;
    // put them back
    ctx.putImageData(pixels,0,0);


  }, 16);

}

function redEffect(pixels) {
  for (var i = 0; i < pixels.data.length; i+= 4) {
    pixels.data[i] = pixels.data[i] + 100; // red
    pixels.data[i + 1] = pixels.data[i+1] - 50; // green
    pixels.data[i + 2] = pixels.data[i+2] * 0.5; // blue
  }
  return pixels;
}

function rbgSplit(pixels) {
  for (var i = 0; i < pixels.data.length; i+= 4) {
    pixels.data[i - 150] = pixels.data[i]; // red
    pixels.data[i + 500] = pixels.data[i+1]; // green
    pixels.data[i - 500] = pixels.data[i+2]; // blue
  }
  return pixels;
}

function takePhoto() {
  // play sound
  snap.curentTime = 0;
  snap.play();
  //  take data out of the canvas
  const picture = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = picture;
  link.setAttribute('download','handsome');
  link.innerHTML = `<img src="${picture}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
