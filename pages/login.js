import React from 'react';
import { getProviders, signIn } from "next-auth/react";
import Image from 'next/image';
import tunesy from '../public/tunesy.png';

function Login({ providers }) {
  return (
    <div className='flex flex-col min-h-screen w-full bg-black justify-center items-center'>
      <Image src={tunesy} alt="Tunesy" className='w-96 mb-4' />

      {/* Can add more login providers like Google, Facebook, etc */}
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button
              className='bg-[#18D860] text-white px-5 py-3 rounded-full'
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              Login with {provider.name}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Login

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    }
  }
}