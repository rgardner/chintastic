# Chintastic
## Converting from `.mov` to `.ogv`
```
brew install ffmpeg --with-theora --with-libvorbis
ffmpeg -i input.mov -c:v libtheora -c:a libvorbis output.ogv
```

## Audio/Video Assets
1. All audio assets should go in the `audio/` directory.
  - for now, the assets are hardcoded in.
  - later they should be named `track1.ogg`, `track2.ogg`, etc.
2. All video assets shoudl go in the `videos` directory.
  - Each video should be labeled `background1.mp4`, `background2.mpg`, etc.
3. **None of this should be in version control**
