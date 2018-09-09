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
    this.commentEl.innerText = commentText;
    // never show comment text and the *prior* image.
    this.imgEl.src = "";
    // this image may take a while to load/render
    this.imgEl.src = imgSrc;

    this.pauseVideo();

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

    if (this.canPlayVideo()) {
      this.playVideo();
    } else {
      this.showImg();
    }
  }

  pauseVideo() {
    this.videoEl.pause();
    this.videoElPlaying = false;
  }

  canPlayVideo() {
    return this.videoElEnabled && !this.videoElPlaying;
  }

  playVideo() {
    // don't play video if there is none, or if video is already
    // playing.
    if (!this.canPlayVideo()) {
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

    this.pauseVideo();
    this.videoEl.currentTime = 0;
  }
}
