'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  quality?: number;
  autoPlay?: boolean;
  showControls?: boolean;
}

interface VideoState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  playbackRate: number;
}

const EnhancedVideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  quality = 2,
  autoPlay = false,
  showControls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [state, setState] = useState<VideoState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    isFullscreen: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    playbackRate: 1,
  });

  // Update video source when videoId or quality changes
  useEffect(() => {
    if (videoRef.current) {
      const videoUrl = `/api/video?videoId=${videoId}&quality=${quality}`;
      videoRef.current.src = videoUrl;
      setIsLoading(true);
    }
  }, [videoId, quality]);

  // Handle video events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        duration: videoRef.current?.duration || 0,
      }));
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        currentTime: videoRef.current?.currentTime || 0,
        buffered: videoRef.current?.buffered.length 
          ? videoRef.current.buffered.end(videoRef.current.buffered.length - 1) 
          : 0,
      }));
    }
  };

  const handlePlay = () => setState(prev => ({ ...prev, isPlaying: true }));
  const handlePause = () => setState(prev => ({ ...prev, isPlaying: false }));
  const handleVolumeChange = () => {
    if (videoRef.current) {
      setState(prev => ({
        ...prev,
        volume: videoRef.current?.volume || 0,
        isMuted: videoRef.current?.muted || false,
      }));
    }
  };

  const handleError = (e: any) => {
    setError('Error loading video');
    setIsLoading(false);
  };

  // Control functions
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (state.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [state.isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !state.isMuted;
    }
  }, [state.isMuted]);

  const handleVolumeSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const volume = parseFloat(e.target.value);
      videoRef.current.volume = volume;
      videoRef.current.muted = volume === 0;
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setState(prev => ({ ...prev, isFullscreen: false }));
    }
  }, []);

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setState(prev => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="relative w-full max-w-4xl mx-auto aspect-video bg-black flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto group"
      onDoubleClick={toggleFullscreen}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white">Loading video...</div>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onVolumeChange={handleVolumeChange}
        onError={handleError}
        autoPlay={autoPlay}
        playsInline
      />

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Progress bar */}
          <div className="relative w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer">
            <input
              type="range"
              min={0}
              max={state.duration}
              value={state.currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="absolute h-full bg-red-600 rounded-full"
              style={{ width: `${(state.currentTime / state.duration) * 100}%` }}
            />
            <div
              className="absolute h-full bg-gray-400 rounded-full"
              style={{ width: `${(state.buffered / state.duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-red-500 transition-colors"
              >
                {state.isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              {/* Volume control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {state.isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={state.volume}
                  onChange={handleVolumeSlider}
                  className="w-20"
                />
              </div>

              {/* Time display */}
              <div className="text-white text-sm">
                {formatTime(state.currentTime)} / {formatTime(state.duration)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Playback speed */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <Settings size={24} />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2">
                    {[0.5, 1, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          changePlaybackRate(rate);
                          setShowSettings(false);
                        }}
                        className={`block w-full px-4 py-2 text-sm text-white hover:bg-red-500 rounded ${
                          state.playbackRate === rate ? 'bg-red-500' : ''
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-red-500 transition-colors"
              >
                {state.isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer; 