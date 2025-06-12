import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  List,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  artwork: string;
  audioUrl?: string;
}

const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Echo",
    album: "Neon Nights",
    duration: "3:24",
    artwork: "https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 2,
    title: "Electric Pulse",
    artist: "Synth Wave",
    album: "Digital Horizon",
    duration: "4:12",
    artwork: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 3,
    title: "Ocean Breeze",
    artist: "Calm Waters",
    album: "Serenity",
    duration: "2:58",
    artwork: "https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 4,
    title: "Urban Rhythm",
    artist: "City Lights",
    album: "Metropolitan",
    duration: "3:45",
    artwork: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 5,
    title: "Cosmic Journey",
    artist: "Space Drift",
    album: "Interstellar",
    duration: "5:21",
    artwork: "https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(sampleTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [isLiked, setIsLiked] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Convert duration string to seconds for demo
  const getDurationInSeconds = (duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    const trackDuration = getDurationInSeconds(currentTrack.duration);
    setDuration(trackDuration);
    setCurrentTime(0);
  }, [currentTrack]);

  // Simulate audio playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration - 1) {
            setIsPlaying(false);
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * sampleTracks.length);
    } else {
      nextIndex = (currentIndex + 1) % sampleTracks.length;
    }
    
    setCurrentTrack(sampleTracks[nextIndex]);
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
    setCurrentTrack(sampleTracks[previousIndex]);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const selectTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setShowPlaylist(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
          >
            <List className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Now Playing</h1>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Album Art */}
        <div className="relative mb-8">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-md">
            <img 
              src={currentTrack.artwork} 
              alt={currentTrack.album}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <button 
              onClick={togglePlay}
              className="text-white hover:scale-110 transition-transform duration-200"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
            {currentTrack.title}
          </h2>
          <p className="text-gray-300 text-lg">{currentTrack.artist}</p>
          <p className="text-gray-400 text-sm">{currentTrack.album}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            ref={progressRef}
            onClick={handleProgressClick}
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-2 overflow-hidden backdrop-blur-md"
          >
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button 
            onClick={toggleShuffle}
            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
              isShuffled 
                ? 'bg-purple-500/30 text-purple-300' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handlePrevious}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
          >
            <SkipForward className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleRepeat}
            className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 relative ${
              repeatMode !== 'off' 
                ? 'bg-purple-500/30 text-purple-300' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Repeat className="w-5 h-5" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white font-bold">1</span>
            )}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="flex-1 max-w-32">
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
          </div>
          <span className="text-sm text-gray-400 w-8 text-center">{isMuted ? 0 : volume}</span>
        </div>
      </div>

      {/* Playlist Overlay */}
      {showPlaylist && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-gradient-to-t from-gray-900 to-gray-800 rounded-t-3xl p-6 max-h-2/3 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Playlist</h3>
              <button 
                onClick={() => setShowPlaylist(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3 overflow-y-auto max-h-80">
              {sampleTracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => selectTrack(track)}
                  className={`flex items-center space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    track.id === currentTrack.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={track.artwork} 
                      alt={track.album}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    {track.id === currentTrack.id && isPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate ${
                      track.id === currentTrack.id ? 'text-purple-300' : 'text-white'
                    }`}>
                      {track.title}
                    </h4>
                    <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                  </div>
                  
                  <span className="text-gray-400 text-sm">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

export default App;