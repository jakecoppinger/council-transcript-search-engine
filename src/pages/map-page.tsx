import rawTranscript from '../data/transcript.json'
import React, { useEffect, useState } from "react";
import { Fzf, FzfResultItem, FzfOptions, byLengthAsc } from "fzf";
const transcript = rawTranscript as WhisperJSONOutput;

interface TranscriptionSegment {
  timestamps: {
    from: string;
    to: string;
  };
  text: string;
  tokens: any[]; // TODO
}

interface WhisperJSONOutput {
  transcription: TranscriptionSegment[]
}
interface SearchSegment extends TranscriptionSegment {
  // Index in all sentences
  originalArrayIndex: number;
}

const sentences = transcript.transcription
  .filter((v) => v.text !== ' (upbeat music)')
  .map((segment: TranscriptionSegment, index: number) =>
    ({ ...segment, originalArrayIndex: index }) as SearchSegment)


const options: FzfOptions<SearchSegment> = {
  // limiting size of the result to avoid jank while rendering it
  limit: 32,
  casing: "case-insensitive",
  selector: (v: SearchSegment) => v.text,
  tiebreakers: []
};

let fzf = new Fzf<SearchSegment[]>(sentences, {
  ...options,
});



interface HighlightCharsProps {
  str: string;
  indices: Set<number>;
}

export const HighlightChars = (props: HighlightCharsProps) => {
  const strArr = props.str.split("");
  const nodes = strArr.map((v, i) => {
    if (props.indices.has(i)) {
      return (
        <span key={i} className="font-semibold">
          {v}
        </span>
      );
    } else {
      return v;
    }
  });

  return <>{nodes}</>;
};


export function MapComponent() {

  const [input, setInput] = useState("");
  const [sentencesToShowStr, setSentencesToShowStr] = useState<number>(2);

  const [entries, setEntries] = useState<FzfResultItem<SearchSegment>[]>([]);
  console.log({ input, entries })
  const first = entries[0]
  console.log({ first })

  const handleSearchInputChange = (input: string) => {
    setInput(input);
    if (input === "") {
      setEntries([]);
      return;
    }

    let entries = fzf.find(input);
    setEntries(entries);
  };
  return (
    <div>
      <div className="px-6">
        <h1>Council Transcript Search Engine</h1>

        <div>
          <input
            autoFocus
            value={input}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            className="py-2 px-3 w-full border-b-2 border-gray-400 outline-none focus:border-purple-500"
            placeholder="Type to search"
          />
          <label>Sentences to show per result?</label>
          <button onClick={() => setSentencesToShowStr(sentencesToShowStr + 1)}>Increase context</button>
          <button onClick={() => setSentencesToShowStr(sentencesToShowStr > 1 ? sentencesToShowStr - 1 : sentencesToShowStr)}>Decrease context</button>
        </div>
        <div className="pt-2">
          {input !== "" ? (
            <ul>
              {entries.map((entry, index) => <SearchMatch entry={entry} index={index} sentencesToShow={sentencesToShowStr} />)}
            </ul>
          ) : null
          }
        </div>
      </div>


      <div id="full-transcript">
        {sentences.map((sentence, i) => <p key={i}>

          <a
            target='_blank'
            rel='noreferrer'
            href={generateYoutubeUrlAtTime(youtubeVideoUrl, sentence.timestamps.from)}>{sentence.timestamps.from}</a>: {sentence.text}</p>)}
      </div>
    </div>);
}
const youtubeVideoUrl = "_RJmSPKSM2Y"

/**
 * 
 * bad: https://www.youtube.com/watch?v=_RJmSPKSM2Y?t=3651s
 * good: https://youtu.be/_RJmSPKSM2Y?t=8346
 * *
 */
/** 
 * Takes in a time of format like 03:30:41,720 (HH:MM:SS,MS) and returns a url to the youtube video at that time.
 * Youtube video urls with time look like this: https://youtu.be/Bs-T7bv6qTk?t=9
 */
function generateYoutubeUrlAtTime(youtubeId: string, time: string) {
  const [hours, minutes, seconds] = time.split(":").map((v) => parseInt(v));
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return `https://youtu.be/${youtubeId}?t=${totalSeconds}`;
}


const SearchMatch = ({ entry, index, sentencesToShow }: { entry: FzfResultItem<SearchSegment>, index: number, sentencesToShow: number }) => {
  const closestSentences = getXClosest(sentences, entry.item.originalArrayIndex, sentencesToShow);
  const closestSentencesJoinedByNewline = closestSentences.map((v) => v.text).join("");
  return <li key={index} className="py-1">
    <a
      target='_blank'
      rel='noreferrer'
      href={generateYoutubeUrlAtTime(youtubeVideoUrl, entry.item.timestamps.from)}>({entry.item.timestamps.from}):</a>

    {/* <HighlightChars str={entry.item.text.normalize()} indices={entry.positions} /> */}
    <div>
      <RenderSentencesWithLinks>{closestSentencesJoinedByNewline}</RenderSentencesWithLinks>
    </div>
    (<span className="text-sm pl-4 italic text-gray-400">score: {entry.score}</span>)
  </li>
}

function getXClosest<T>(a: T[], targetIndex: number, numLinesToShow: number) {
  const left = Math.max(0, targetIndex - numLinesToShow);
  const right = Math.min(a.length, targetIndex + numLinesToShow);
  return a.slice(left, right);
}



/**
 * A component that takes in a string, and replaces every mention of `<something> street` (not
 * case sensitive) with a link to http://maps.google.com/?q=<something>+street+sydney
 */
const RenderSentencesWithLinks = ({ children }: { children: string }) => {
  const regex = /(\w+ street)/gi;
  const parts = children.split(regex);
  console.log({parts});
  const nodes = parts.map((part, i) => {
    if (i % 2 === 0) {
      return part;
    } else {
      // return <a href={`http://maps.google.com/?q=${part}+sydney`} target="_blank" rel="noreferrer">{part}</a>
      return <a href={`https://www.openstreetmap.org/search?query=${part}%20street%20randwick&layers=Y`} target="_blank" rel="noreferrer">{part}</a>
      
    }
  });

  return <>{nodes}</>
}