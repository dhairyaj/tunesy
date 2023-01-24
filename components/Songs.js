import { playlistDataState } from '@/atoms/playlistAtom'
import React from 'react'
import { useRecoilValue } from 'recoil'
import Song from './Song';

function Songs() {

    // Fetch the data of playlist
    const playlist = useRecoilValue(playlistDataState);

    return (
        <div className='px-6 flex flex-col space-y-1 pb-28'>
            {playlist?.tracks.items.map((trackData, index) => {
                return (
                    <Song key={trackData.track.id} info={trackData} order={index} />
                )
            })}
        </div>
    )
}

export default Songs