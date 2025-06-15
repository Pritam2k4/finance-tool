
import React, { useState } from 'react';
import { Playlist, MusicTrack, AmbientSound } from '../../types';
import { AMBIENT_SOUNDS } from '../../constants';
import Button from '../common/Button';

// Placeholder Icons
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const SkipNextIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>;
const SkipPreviousIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>;
const VolumeUpIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>;


interface MusicPlayerProps {
  playlists: Playlist[];
  userName: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ playlists, userName }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(playlists[0] || null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Mock volume 0 to 1
  const [activeAmbientSound, setActiveAmbientSound] = useState<string | null>(null);

  const currentTrack = selectedPlaylist?.tracks[currentTrackIndex];

  const handlePlayPause = () => {
    if (currentTrack) setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (selectedPlaylist) {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % selectedPlaylist.tracks.length);
      setIsPlaying(true); // Auto-play next
    }
  };

  const handlePrevTrack = () => {
    if (selectedPlaylist) {
      setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + selectedPlaylist.tracks.length) % selectedPlaylist.tracks.length);
      setIsPlaying(true); // Auto-play prev
    }
  };
  
  const handlePlaylistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const playlist = playlists.find(p => p.id === e.target.value);
    setSelectedPlaylist(playlist || null);
    setCurrentTrackIndex(0);
    setIsPlaying(false);
  };

  const toggleAmbientSound = (soundId: string) => {
    if (activeAmbientSound === soundId) {
      setActiveAmbientSound(null);
      console.log(`Ambient sound ${soundId} stopped.`);
    } else {
      setActiveAmbientSound(soundId);
      console.log(`Ambient sound ${soundId} playing.`);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-red-500/30 dark:from-purple-800/50 dark:via-pink-800/50 dark:to-red-800/50 backdrop-blur-lg rounded-xl shadow-2xl text-white">
      <h3 className="text-2xl font-zen-dots text-center mb-4 text-shadow-md">Tune In, {userName}-senpai!</h3>
      
      <div className="mb-4">
        <label htmlFor="playlist-select" className="block text-sm font-medium mb-1">Select Playlist:</label>
        <select
            id="playlist-select"
            value={selectedPlaylist?.id || ''}
            onChange={handlePlaylistChange}
            className="w-full p-2.5 rounded-md bg-white/20 dark:bg-black/30 text-white border border-white/30 focus:ring-2 focus:ring-pink-400 outline-none"
        >
            {playlists.map(pl => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
        </select>
      </div>

      {currentTrack ? (
        <div className="text-center bg-black/30 p-4 rounded-lg shadow-inner">
          <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-32 h-32 md:w-40 md:h-40 rounded-lg mx-auto mb-3 shadow-lg border-2 border-white/30"/>
          <p className="text-lg font-semibold truncate" title={currentTrack.title}>{currentTrack.title}</p>
          <p className="text-sm opacity-80 truncate" title={currentTrack.artist}>{currentTrack.artist}</p>
          <div className="w-full h-1.5 bg-white/30 rounded-full my-3 overflow-hidden">
             <div className="h-full bg-pink-400 animate-pulse" style={{width: isPlaying ? '100%' : '0%', transition: isPlaying ? 'width 60s linear' : 'none'}}></div>
          </div>
        </div>
      ) : (
        <p className="text-center py-8 opacity-70">Select a playlist to start.</p>
      )}

      <div className="flex items-center justify-center space-x-3 md:space-x-4 my-5">
        <Button onClick={handlePrevTrack} variant="ghost" className="!text-white !p-2 md:!p-3" aria-label="Previous track" disabled={!currentTrack}><SkipPreviousIcon className="w-5 h-5 md:w-6 md:h-6" /></Button>
        <Button onClick={handlePlayPause} variant="primary" className="!bg-pink-500 hover:!bg-pink-600 !p-3 md:!p-4 !rounded-full shadow-lg" aria-label={isPlaying ? "Pause" : "Play"} disabled={!currentTrack}>
          {isPlaying ? <PauseIcon className="w-6 h-6 md:w-8 md:h-8" /> : <PlayIcon className="w-6 h-6 md:w-8 md:h-8" />}
        </Button>
        <Button onClick={handleNextTrack} variant="ghost" className="!text-white !p-2 md:!p-3" aria-label="Next track" disabled={!currentTrack}><SkipNextIcon className="w-5 h-5 md:w-6 md:h-6" /></Button>
      </div>
      
      <div className="flex items-center space-x-2 px-2">
        <VolumeUpIcon className="w-5 h-5 opacity-80" />
        <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
            aria-label="Volume control"
            disabled={!currentTrack}
        />
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <h4 className="text-md font-semibold mb-2 text-center opacity-90">Ambient Sounds</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMBIENT_SOUNDS.map(sound => (
            <Button
              key={sound.id}
              onClick={() => toggleAmbientSound(sound.id)}
              variant={activeAmbientSound === sound.id ? "secondary" : "ghost"}
              className={`w-full !text-white ${activeAmbientSound === sound.id ? '!bg-pink-500/70' : '!bg-white/10 hover:!bg-white/20'}`}
              leftIcon={sound.icon}
            >
              {sound.name}
            </Button>
          ))}
        </div>
      </div>
      <p className="text-xs text-center mt-4 opacity-60">Mock Player: Actual audio playback not implemented.</p>
    </div>
  );
};

export default MusicPlayer;
