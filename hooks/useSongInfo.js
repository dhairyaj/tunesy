import { currentSongIdState } from '@/atoms/songAtom';
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import useSpotify from './useSpotify';

function useSongInfo() {

    // Call spotifyAPI using custom hook useSpotify
    const spotifyApi = useSpotify();

    // Get/Set id of current playing song
    const [currentSongId, setCurrentSongId] = useRecoilState(currentSongIdState);

    // Set the song info
    const [songInfo, setSongInfo] = useState(null);

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentSongId) {
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentSongId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
                        }
                    }
                ).then(res => res.json());

                setSongInfo(trackInfo);
            }
        }

        fetchSongInfo();

    }, [currentSongId, spotifyApi]);

    return songInfo;
}

export default useSongInfo