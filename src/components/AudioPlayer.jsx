import React, { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';
import { IoMdRewind } from 'react-icons/io';
import metalImage from '../assets/metal.png';
import { RiPlayListFill } from 'react-icons/ri';
import { PLAYLIST } from '../utils/dummyPlaylist';
import { FaPlay, FaPause, FaHeart } from 'react-icons/fa';

export const AudioPlayer = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlaylist, setShowPLaylist] = useState(false);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlaylist = () => {
    setShowPLaylist(!showPlaylist);
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      '--seek-before-width',
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 30);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(progressBar.current.value + 30);
    changeRange();
  };

  return (
    <div
      className={`shadow-2xl max-w-sm mx-auto my-4 flex flex-col bg-red-500 ${
        !showPlaylist && 'rounded-full'
      }`}
      style={{ borderRadius: showPlaylist && '5rem' }}
    >
      {/* PLAYER */}
      <div
        className={`flex items-center gap-4 p-4 bg-white max-w-md ${
          !showPlaylist && 'rounded-full'
        }`}
        style={{
          borderTopLeftRadius: showPlaylist && '5rem',
          borderTopRightRadius: showPlaylist && '5rem',
        }}
      >
        <img
          alt="moto"
          src={metalImage}
          className="shadow-song-img rounded-full h-28 w-28"
        />
        <div className="flex flex-col items-center">
          <audio
            className="bg-green-400 w-1"
            ref={audioPlayer}
            src="https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3"
            preload="metadata"
          ></audio>
          <div className="flex flex-col items-start justify-start gap-2">
            {/* SONG DESCRIPTION */}
            <div className="flex flex-col items-start justify-start">
              <div className="text-sm font-mono font-bold m-0 p-0">
                Afraid (ft. HARLEE)
              </div>
              <div className="text-xs font-mono m-0 p-0">
                James Hype, HARLEE
              </div>
            </div>

            {/* TIMELINE */}
            <div className="flex flex-col">
              {/* progress bar */}
              <div>
                <input
                  type="range"
                  className="progressBar w-full"
                  defaultValue="0"
                  ref={progressBar}
                  onChange={changeRange}
                />
              </div>
              <div className="flex items-center justify-between">
                {/* current time */}
                <div className="font-mono text-xs">
                  {calculateTime(currentTime)}
                </div>
                {/* duration */}
                <div className="font-mono text-xs">
                  {duration && !isNaN(duration) && calculateTime(duration)}
                </div>
              </div>
            </div>

            {/* AUDIO CONTROLS */}
            <div className="flex gap-3 items-center justify-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  className="flex items-center justify-center gap-1 hover:text-red-600 rounded-lg cursor-pointer"
                  onClick={backThirty}
                >
                  <IoMdRewind className="text-lg text-blue-700" />{' '}
                  <div className="text-xs">30</div>
                </button>
                <button
                  onClick={togglePlayPause}
                  className="flex items-center justify-center text-blue-700 hover:text-red-600 rounded-full text-xl cursor-pointer"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button
                  className="flex items-center gap-1 text-blue-700 hover:text-red-600 rounded-lg cursor-pointer"
                  onClick={forwardThirty}
                >
                  <div className="text-xs">30</div>
                  <IoMdRewind className="text-lg transform rotate-180" />
                </button>
              </div>

              <FaHeart className="text-lg text-red-600 cursor-pointer" />
              <RiPlayListFill
                onClick={togglePlaylist}
                className="text-purple-600 text-lg font-extrabold cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      {/* PLAYLIST CONTAINER */}
      <div
        className={`bg-blue-200 py-4 px-12 w-full ${
          !showPlaylist && 'hidden'
        } ${showPlaylist && 'shadow-2xl'}`}
        style={{
          borderBottomLeftRadius: showPlaylist && '5rem',
          borderBottomRightRadius: showPlaylist && '5rem',
        }}
      >
        <ul className="flex flex-col items-start justify-evenly gap-3 w-50">
          {PLAYLIST.map((song, index) => (
            <li key={index} className="flex items-center justify-evenly gap-3">
              <div
                className={`w-8 h-8 border-4 ${
                  song.title.toLowerCase().includes('afraid')
                    ? 'border-green-600'
                    : 'border-blue-600'
                } rounded-full `}
              ></div>
              <div className="flex flex-col items-start justify-start">
                <div className="text-sm font-mono font-bold m-0 p-0">
                  {song.title}
                </div>
                <div className="text-xs font-mono m-0 p-0">{song.artists}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
