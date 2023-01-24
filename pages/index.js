import Dashboard from "@/components/Dashboard";
import MusicPlayer from "@/components/MusicPlayer";
import Sidebar from "@/components/Sidebar";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        {/* Render the sidebar to control navs and playlist */}
        <Sidebar />
        {/* Render the central dashboard to see all the information */}
        <Dashboard />
      </main>

      {/* Render the music player component */}
      <div className="sticky bottom-0">
        <MusicPlayer />
      </div>
    </div>
  )
}

// Pre-render user on server end and generate session access token before coming to client
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}