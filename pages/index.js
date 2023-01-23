import Dashboard from "@/components/Dashboard";
import Sidebar from "@/components/Sidebar";

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
