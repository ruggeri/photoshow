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
