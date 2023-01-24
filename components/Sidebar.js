import React, { useEffect, useState } from 'react';
import { HomeIcon, BuildingLibraryIcon, MagnifyingGlassIcon, PlusCircleIcon, HeartIcon, RssIcon } from '@heroicons/react/24/outline'
import { useSession, signOut } from 'next-auth/react';
import useSpotify from '@/hooks/useSpotify';


function Sidebar() {
    // Call spotifyAPi using custom useSpotify Hook
    const spotifyApi = useSpotify();

    // To get session details
    const { data: session, status } = useSession();

    // To manage playlists
    const [playlists, setPlaylists] = useState([]);

    // To fetch the playlist id
    const [playlistId, setPlaylistId] = useState(null);

    // When sidebar mounts and depends on session and spotifyApi
    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then(data => {
                setPlaylists(data.body.items);
            })
        }
    }, [session, spotifyApi]);

    return (
        <div className='text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen'>
            <div className='space-y-4'>
                <button className='flex items-center space-x-2 hover:text-white' onClick={() => { signOut() }}>
                    <p>Log Out</p>
                </button>
                {/* Nav options like Home, Search, etc go here */}
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HomeIcon className="h-5 w-5" />
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <BuildingLibraryIcon className="h-5 w-5" />
                    <p>Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900' />
                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className="h-5 w-5" />
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className="h-5 w-5" />
                    <p>Podcast Episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900' />

                {/* Playlists go here */}
                {playlists.map((playlist) => {
                    return (
                        <p key={playlist.id} className='cursor-pointer hover:text-white' onClick={() => { setPlaylistId(playlist.id) }}>{playlist.name}</p>
                    )
                })}

            </div>
        </div>
    )
}

export default Sidebar