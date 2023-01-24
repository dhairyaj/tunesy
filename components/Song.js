import { currentSongIdState, isPlayingState } from '@/atoms/songAtom';
import useSpotify from '@/hooks/useSpotify'
import { millisToMinutesAndSeconds } from '@/lib/duration';
import React from 'react'
import { useRecoilState } from 'recoil';

function Song({ info, order }) {

    // Call spotifyAPI using custom hook useSpotify
    const spotifyApi = useSpotify();

    // Get/Set id of current playing song
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);

    // Get/Set if the song is playing or not
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    // Function to detect which song to play
    const playSong = () => {
        setCurrentSongId(info.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [info.track.uri]
        })
    };

    return (
        <div className='grid grid-cols-2 text-slate-500 hover:text-white py-2 px-5 hover:bg-gray-900 rounded-2xl cursor-pointer text-sm' onClick={playSong}>
            <div className='flex items-center space-x-4'>
                <p>{order + 1}</p>
                <img src={info.track.album.images[0].url} alt={info.track.name} className='h-10 w-10' />
                <div>
                    <p className='text-white w-36 lg:w-64 truncate'>{info.track.name}</p>
                    <p className='w-36 lg:w-64 truncate'>{info.track.artists[0].name}</p>
                </div>
            </div>
            <div className='flex items-center justify-between ml-auto md:ml-0'>
                <p className='w-36 lg:w-64 truncate hidden md:inline'>{info.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(info.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song