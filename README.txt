# Requirements

* Ruby.
* FFmpeg with libx264 support.

# Use

* First, use bin/strip-audio to remove all audio from the mov files.
* Second, create h.264 copies of the noaudio mov files using
  hevc-to-264.
* Third, build the manifest by using `build-photos-manifest`. You'll
  want to do something like `build-photos-manifest *noaudio*.mov
  *jpg`.
