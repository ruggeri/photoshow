class LivePhotoController {
  constructor({ imgEl, videoEl, commentEl }) {
    this.imgEl = imgEl;
    this.videoEl = videoEl;
    this.commentEl = commentEl;

    this.videoElPlaying = false;
    this.videoElEnabled = false;

    this.imgEl.addEventListener("mouseover", () => {
      this.playVideo();
    });
    this.imgEl.addEventListener("touchstart", () => {
      this.playVideo();
    });
    this.videoEl.addEventListener("ended", () => this.showImg());
  }

  display({ imgSrc, videoSrcs, commentText }) {
    this.imgEl.src = imgSrc;

    this.videoEl.pause();

    // Clear out sources.
    while (this.videoEl.firstChild) {
      this.videoEl.removeChild(this.videoEl.firstChild);
    }

    // Add new sources.
    videoSrcs.forEach((videoSrc) => {
      const sourceEl = document.createElement("source");
      sourceEl.src = videoSrc.src;
      sourceEl.type = "video/mp4; codecs=\"" + videoSrc.codec + "\"";
      this.videoEl.appendChild(sourceEl);
    });

    this.videoEl.load();

    // Enable video element?
    if (this.videoEl.childNodes.length > 0) {
      this.videoElEnabled = true;
    } else {
      this.videoElEnabled = false;
    }

    this.commentEl.innerText = commentText;

    this.showImg();
  }

  playVideo() {
    // don't play video if there is none, or if video is already
    // playing.
    if (!this.videoElEnabled || this.videoElPlaying) {
      return;
    }

    this.imgEl.style.display = "none";
    this.videoEl.style.display = null;
    this.videoEl.play();
    this.videoElPlaying = true;
  }

  showImg() {
    this.imgEl.style.display = null;
    this.videoEl.style.display = "none";

    this.videoEl.pause();
    this.videoEl.currentTime = 0;
    this.videoElPlaying = false;
  }
}

class PhotoshowController {
  constructor({ cback, photoshowEntries }) {
    this.cback = cback;
    this.photoshowEntries = photoshowEntries;
    this.currentIndex = 0;

    this.cback(this.currentEntry());

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowRight") {
        this.advance(+1);
      } else if (e.key == "ArrowLeft") {
        this.advance(-1);
      }
    });

    this.hammertime = new Hammer(document.body);
    this.hammertime.on("swipeleft", (e) => this.advance(+1));
    this.hammertime.on("swiperight", (e) => this.advance(-1));
  }

  currentEntry() {
    return this.photoshowEntries[this.currentIndex];
  }

  numEntries() {
    return this.photoshowEntries.length;
  }

  advance(increment) {
    this.currentIndex = (
      (this.currentIndex + increment) % this.numEntries()
    );
    // This protects against the weird behavior if currentIndex
    // becomes negative...
    this.currentIndex = (
      (this.currentIndex + this.numEntries()) % this.numEntries()
    );

    this.cback(this.currentEntry());
  }
}

function initializePhotoshow() {
  const imgEl = document.getElementById("live-photo-img");
  const videoEl = document.getElementById("live-photo-video");
  const commentEl = document.getElementById("live-photo-comment");

  fetch("./data.json")
    .then((response) => response.json())
    .then((photoshowEntries) => {
      const livePhotoController = new LivePhotoController({
        imgEl,
        videoEl,
        commentEl,
      });

      new PhotoshowController({
        photoshowEntries,
        cback: (entry) => livePhotoController.display(entry),
      });
    });
}

function computeVhUnits() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty(
    '--vh',
    vh + "px",
  );
}

computeVhUnits();
window.addEventListener('resize', computeVhUnits);
