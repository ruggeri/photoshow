function initializePhotoshow() {
  const photoshowEl = document.getElementById("photoshow");
  const imgEl = document.getElementById("live-photo-img");
  const videoEl = document.getElementById("live-photo-video");
  const commentEl = document.getElementById("live-photo-comment");

  const dataUrl = photoshowEl.dataset["jsonUrl"];

  fetch(dataUrl)
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
