import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { shuffle } from 'lodash';

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
    // To fetch session details
    const { data: session } = useSession();

    // To maintain header color state
    const [color, setColor] = useState(null);

    useEffect(() => {
        setColor(shuffle(headerColors).pop());
    }, []);


    return (
        <div className='flex-grow'>
            <header className='absolute top-5 right-8'>
                <div className='flex items-center justify-center text-white bg-black space-x-3 p-1 pr-2 rounded-full opacity-90 hover:opacity-80 cursor-pointer'>
                    <img src={session?.user.image} alt="Profile" className='w-10 h-10 rounded-full' />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className='h-5 w-5' />
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>

            </section>
        </div>
    )
}

export default Dashboard