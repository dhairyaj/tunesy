import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <main className="flex">
        <Sidebar />
        <Dashboard />
      </main>
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