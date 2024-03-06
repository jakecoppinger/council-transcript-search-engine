#!/usr/bin/env bash
set -e
set +x

# If env var $WHISPER_PATH is not set, exit with error code 1 stating "WHISPER_PATH env var not set"
if [ -z "$WHISPER_PATH" ]; then
  echo "Error: WHISPER_PATH env var not set. Use export WHISPER_PATH=... to the path of whisper.cpp repo you've cloned (excluding trailing slash)."
  exit 1
fi

# If no arg provided, exit with error code 1 stating "name of output required as argument"
if [ -z "$1" ]; then
  echo "Error: Name of output required as argument. If name is MEETING_BLAH, then MEETING_BLAH.json and MEETING_BLAH.txt will be generated."
  exit 1
fi

echo "Transcoding, will take a while. Run tail -F $1.txt to see progress."

# ggml-large-v2.bin doesn't seem to get stuck and make repeating lines
$WHISPER_PATH/main -f output.wav -m $WHISPER_PATH/models/ggml-large-v2.bin --output-json-full  --entropy-thold 2.8  --output-file "$1" > "$1.txt"

echo "Done! See $1.json and $1.txt."