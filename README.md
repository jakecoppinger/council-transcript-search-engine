# Council Transcript Search Engine

Tools for generating transcripts of council meeting recordings (using OpenAI Whisper) and fuzzy
searching through them.

Warning: Most councils do not permit republishing this video file. I do not know the legality of
resharing council transcripts (especially AI generated ones) in Australia. Defamation law is also
a concern for AI generated transcripts. Only self-host this unless you know what you're doing.
I am not hosting any transcripts or re-sharing any council recordings as part of this project.

This was built in an afternoon, likely has bugs.

PRs very welcome!

# Quick start
## Install whisper.cpp

See git clone https://github.com/ggerganov/whisper.cpp.git for more detail.

...
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp
bash ./models/download-ggml-model.sh ggml-large-v2.bin # Has less repeating line issues than v3
make # Build it
export WHISPER_PATH=PATH_TO_YOUR_WHISPER-CPP-WITHOUT_TRAILING_SLASH
```

## Install yt-dlp if you're downloading from Youtube

On macOS
```bash
brew install yt-dlp
```

## Download your council video

Warning: Most councils do not permit republishing this video file.

```
./download-youtube-wav.sh https://www.youtube.com/watch?v=_vEJNAHK4uk
```

## Transcribe your council video

Warning: I do not know the legality of resharing council transcripts in Australia. Defamation law
is also a concern for AI generated transcripts.

```
./transcribe.sh YOUR_COUNCIL_MEETING_NAME
```

You will now have `YOUR_COUNCIL_MEETING_NAME.txt` and `YOUR_COUNCIL_MEETING_NAME.json`

# Copy your transcript into the code and run the app

```
cp YOUR_COUNCIL_MEETING_NAME.json src/data/
nvm use
npm i
npm run
```

Now open `http://localhost:3000`!

# Other council video sources

# Method for City of Sydney

- Download video of meeting from https://webcast.cityofsydney.nsw.gov.au/
- Convert video to mp3:

```
ffmpeg -i input.mp4  -vn -b:a 128k output.mp3
```

```
# Need toconvert to wav. Todo: go straight from video to wav.
ffmpeg -i input.mp3 -ar 16000 -ac 1 -c:a pcm_s16le output.wav
```

# Docker transcode method

- Likely much slower than whisper.cpp
- Not tested with this repo

- Run Docker container with OpenAI Whisper AI text transcription (open source) with `medium` model

```
docker run -d -p 9000:9000 -e ASR_MODEL=medium onerahmet/openai-whisper-asr-webservice:latest
```

- Use the `/asr` endpoint on http://localhost:9000/ to transcribe the `mp3` (overnight, takes a while!)


# Dev setup

- Install Node Version Manager (nvm) (https://github.com/nvm-sh/nvm)
- Use correct node version from `.nvmrc`: `nvm use`
- Install packages: `npm install`


## Dev server

`npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Tests

See Jest docs for args for watching files etc.

Note: No tests implemented :)

`yarn test`

## Production build

`yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

See above warnings about publicly hosting meeting videos or transcripts.

# Author

Initial implementation by Jake Coppinger (https://jakecoppinger.com).

Note: I am not hosting any transcripts or re-sharing any council recordings as part of this.

# License

GNU AGPLv3. See LICENSE.
