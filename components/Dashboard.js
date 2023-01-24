import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistDataState, playlistIdState } from '@/atoms/playlistAtom';
import useSpotify from '@/hooks/useSpotify';
import Songs from './Songs';

// Header colors
const headerColors = [
    "from-sky-800",
    "from-cyan-600",
    "from-red-600",
    "from-teal-600",
    "from-slate-600",
    "from-amber-600",
    "from-emerald-600",
    "from-fuchsia-700"
]

function Dashboard() {

    // Call spotifyAPI using custom hook useSpotify
    const spotifyApi = useSpotify();

    // To fetch session details
    const { data: session } = useSession();

    // To maintain header color state
    const [color, setColor] = useState(null);

    // Fetch the value of playlistId from global state
    const playlistId = useRecoilValue(playlistIdState);

    // Fetch/save value of playlist data
    const [playlistData, setPlaylistData] = useRecoilState(playlistDataState);

    // Set header color when component mounts and playlist is changed
    useEffect(() => {
        setColor(shuffle(headerColors).pop());
    }, [playlistId]);

    //
    useEffect(() => {
        spotifyApi.getPlaylist(playlistId).then(data => {
            setPlaylistData(data.body);
        }).catch(error => console.log("Something went wrong...!", error));
    }, [spotifyApi, playlistId]);

    return (
        <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
            <header className='absolute top-5 right-8'>
                <div className='flex items-center justify-center text-white bg-black space-x-3 p-1 pr-2 rounded-full opacity-90 hover:opacity-80 cursor-pointer' onClick={signOut}>
                    <img src={session?.user.image} alt="Profile" className='w-10 h-10 rounded-full' />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className='h-5 w-5' />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img className='h-44 w-44 shadow-2xl' src={playlistData?.images?.[0]?.url} alt={playlistData?.name} />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlistData?.name}</h1>
                </div>
            </section>

            {/* Songs come here */}
            <div>
                <Songs />
            </div>
        </div>
    )
}

export default Dashboard