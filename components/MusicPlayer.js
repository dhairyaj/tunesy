import { currentSongIdState, isPlayingState } from '@/atoms/songAtom';
import useSongInfo from '@/hooks/useSongInfo';
import useSpotify from '@/hooks/useSpotify';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { ArrowsRightLeftIcon, PlayCircleIcon, PauseCircleIcon, ForwardIcon, BackwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { SpeakerWaveIcon as VolumeDownIcon, HeartIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';

function MusicPlayer() {

    // Call spotifyAPI using custom hook useSpotify
    const spotifyApi = useSpotify();

    // To fetch session details
    const { data: session } = useSession();

    // Get/Set id of current playing song
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);

    // Get/Set if the song is playing or not
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    // Set/Get the volume of the player
    const [volume, setVolume] = useState(50);

    // Fetch songInfo using custom hook useSongInfo
    const songInfo = useSongInfo();

    // Fetch curernt song info playing on user device if no song info is present initially
    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                setCurrentSongId(data.body?.item?.id);
            })

            spotifyApi.getMyCurrentPlaybackState().then(data => {
                setIsPlaying(data.body?.is_playing);
            })
        }
    }

    // Handle the play/pause of the song
    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            } else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        });
    };

    // Fetch the song info as component mounts
    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentSongId) {
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentSongId, spotifyApi, session]);

    // Adjust the volume such that api request is done only after some fixed interval of time after changing volume
    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustedVolume(volume);
        }
    }, [volume]);

    // Set the music volume after 300ms of user's modification of volume
    // Basically once the user sets the volume, add a delay of 300ms to set the volume state to prevent multiple calls
    const debouncedAdjustedVolume = useCallback(
        debounce(volume => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 300), []
    );

    return (
        <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 '>
            {/* song info */}
            <div className='flex items-center space-x-4 justify-start'>
                <img className='w-10 h-10' src={songInfo?.album.images?.[0]?.url} />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* Song controls */}
            <div className='flex items-center justify-evenly'>
                <ArrowsRightLeftIcon className='musicControl' />
                <BackwardIcon className='musicControl'
                    onClick={() => spotifyApi.skipToPrevious()}
                />
                {isPlaying ? (<PauseCircleIcon className='musicControl w-10 h-10' onClick={handlePlayPause} />) : (<PlayCircleIcon className='musicControl w-10 h-10' onClick={handlePlayPause} />)}
                <ForwardIcon className='musicControl'
                    onClick={() => spotifyApi.skipToNext()}
                />
                <ArrowPathIcon className='musicControl' />
            </div>

            {/* Volume controls */}
            <div className='flex items-center justify-end space-x-3 md:space-x-4 pr-5'>
                {volume !== 0 ? (<VolumeDownIcon className='musicControl' onClick={() => volume > 0 && setVolume(volume - 10)} />) : (<SpeakerXMarkIcon className='musicControl' />)}
                <input className='w-16 md:w-32' type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))} />
                <SpeakerWaveIcon className='musicControl' onClick={() => volume < 100 && setVolume(volume + 10)} />
            </div>
        </div>
    )
}

export default MusicPlayer