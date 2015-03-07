# Chintastic
## Converting from `.mov` to `.ogv`
```
brew install ffmpeg --with-theora --with-libvorbis
ffmpeg -i input.mov -c:v libtheora -c:a libvorbis output.ogv
```
