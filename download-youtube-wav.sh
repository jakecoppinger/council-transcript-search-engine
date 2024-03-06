#!/usr/bin/env bash
set -e
set +x

# If no argument is provided, exit with error code and echo "Youtube URL required as argument"
if [ -z "$1" ]; then
  echo "Youtube URL required as argument"
  exit 1
fi

rm -f output.wav
# Whisper.cpp needs 16khz wavs (they're big)
yt-dlp -f bestaudio --extract-audio --audio-format wav --postprocessor-args "-ar 16000" "$1" -o output.wav

# ~/others_repos/whisper.cpp/main -f /Users/jake/repos/private-cos-meeting-transcripts/output.wav -m ~/others_repos/whisper.cpp/models/ggml-large-v2.bin  --output-json-full  --entropy-thold 2.8 > inner-west-13th-feb.txt

echo "Done. Output is in output.wav. Run transcode.sh YOURFILENAME to generate YOURFILENAME.json and YOURFILENAME.txt."
