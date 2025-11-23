import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward, Settings, Captions } from 'lucide-react';
import type { Video } from '../types';

interface VideoPlayerProps {
  videoUrl: string;
  nextVideo: Video | null;
  onNext: (video: Video) => void;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, nextVideo, onNext, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current);
    if (isPlaying) {
      controlTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowOverlay(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
      setDuration(total);

      if (current >= total && !showOverlay) {
        setIsPlaying(false);
        setShowOverlay(true);
        setShowControls(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTo;
      setProgress(parseFloat(e.target.value));
      setCurrentTime(seekTo);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full group bg-black select-none ${isFullScreen ? 'h-screen' : 'aspect-video rounded-xl overflow-hidden shadow-2xl'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Up Next Overlay */}
      {showOverlay && nextVideo && (
        <div className="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center text-center animate-fade-in backdrop-blur-sm">
          <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-semibold">Up Next</p>
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div 
                className="relative group/next cursor-pointer w-64 aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-white transition-all"
                onClick={() => onNext(nextVideo)}
              >
                <img src={nextVideo.thumbnail} alt="Next" className="w-full h-full object-cover opacity-80 group-hover/next:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Play size={40} className="fill-white text-white drop-shadow-lg scale-0 group-hover/next:scale-100 transition-transform" />
                </div>
                <div className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">{nextVideo.duration}</div>
             </div>
             <div className="text-left max-w-xs">
                 <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{nextVideo.title}</h3>
                 <p className="text-gray-400">{nextVideo.channelName}</p>
                 
                 <div className="flex gap-3 mt-4">
                    <button 
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                                videoRef.current.play();
                                setShowOverlay(false);
                            }
                        }} 
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors"
                    >
                        Replay
                    </button>
                    <button 
                        onClick={() => onNext(nextVideo)} 
                        className="px-6 py-2 bg-white text-black hover:bg-gray-200 rounded-full font-medium transition-colors"
                    >
                        Play Now
                    </button>
                 </div>
             </div>
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Gradient Shadow */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        <div className="relative px-3 pb-3">
          {/* Progress Bar Container */}
          <div className="group/scrubber relative w-full h-1 hover:h-1.5 bg-gray-600/50 cursor-pointer mb-2 transition-all rounded-full">
             {/* Buffered (Mock) */}
             <div className="absolute top-0 left-0 h-full bg-gray-400/50 rounded-full" style={{ width: `${progress + 10}%` }}></div>
             {/* Played */}
             <div className="absolute top-0 left-0 h-full bg-[#f00] rounded-full" style={{ width: `${progress}%` }}></div>
             {/* Scrubber Head */}
             <div 
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#f00] rounded-full scale-0 group-hover/scrubber:scale-100 transition-transform shadow" 
                style={{ left: `${progress}%` }}
             />
             <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={(e) => togglePlay(e)} className="hover:text-gray-200 p-1">
                {isPlaying ? <Pause size={28} className="fill-white" /> : <Play size={28} className="fill-white" />}
              </button>
              
              {nextVideo && (
                  <button onClick={() => onNext(nextVideo)} className="hover:text-gray-200 p-1 hidden sm:block">
                      <SkipForward size={20} className="fill-white"/>
                  </button>
              )}

              <div className="flex items-center gap-2 group/volume ml-2">
                <button onClick={toggleMute} className="p-1">
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                     <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        setIsMuted(val === 0);
                        if (videoRef.current) videoRef.current.volume = val;
                        }}
                        className="w-16 h-1 accent-white bg-white/30 rounded-lg cursor-pointer"
                    />
                </div>
              </div>

              <span className="text-xs md:text-sm font-medium ml-2">
                  {formatTime(currentTime)} <span className="text-gray-400">/ {formatTime(duration)}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Settings">
                    <Settings size={20} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Miniplayer">
                    <Captions size={20} />
                </button>
                <button onClick={toggleFullScreen} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Fullscreen">
                    {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;