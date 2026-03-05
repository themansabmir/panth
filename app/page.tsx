import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fb]">
      {/* HEADER */}
      <header className="top-bar flex items-center gap-4 px-8 py-4 bg-[#0b3c6d] text-white">
        <div className="logo w-12 h-12 bg-white text-[#0b3c6d] font-bold rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="#0b3c6d">
            <path d="M9 2a3 3 0 00-3 3v1a3 3 0 000 6v1a3 3 0 003 3h1v-2H9a1 1 0 01-1-1v-2H7a1 1 0 010-2h1V6a1 1 0 011-1h2V3a1 1 0 00-1-1H9zm6 0a3 3 0 00-1 5v2h1a1 1 0 010 2h-1v2a1 1 0 01-1 1h-1v2h1a3 3 0 003-3v-1a3 3 0 000-6V5a3 3 0 00-1-3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl m-0">Headache Registry</h1>
          <p className="text-sm opacity-90 m-0">Clinical Data & Patient Management Portal</p>
        </div>
      </header>

      {/* DASHBOARD HEADER */}
      <div className="dashboard-header max-w-[1200px] mx-auto mt-6 mb-2.5 px-6 w-full">
        <h2 className="text-3xl font-bold m-0 mb-1.5 text-slate-800">Registry Dashboard</h2>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="cards-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto mt-4 px-6 w-full">
        <Link href="/enroll" className="card yellow bg-linear-to-br from-[#acefde] to-[#ffbb70] p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          Enrollment of new patients
        </Link>

        {/* Placeholder cards */}
        <div className="card green bg-linear-to-br from-[#a8e063] to-[#4c7a45] p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          Patient experience
        </div>

        <Link href="/patients" className="card red bg-linear-to-br from-[#ff416c] to-[#ff4b2b] text-white p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          Link to patient tab (excel and coding)
        </Link>

        <div className="card pink bg-linear-to-br from-[#ff9a9e] to-[#fad0c4] p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          COMBAT diagnostic algorithm
        </div>

        <div className="card magenta bg-linear-to-br from-[#f4e900] to-[#fc506e] text-white p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          Audit tab
        </div>

        <div className="card grey bg-linear-to-br from-[#a8f368] to-[#f9035e] p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          Graphs and trends
        </div>

        <Link href="/patients" className="card slate bg-linear-to-br from-[#008bff] to-[#008ffa] text-white p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          Patient information Tab
        </Link>

        <div className="card purple bg-linear-to-br from-[#8e2de2] to-[#4a00e0] text-white p-7 rounded-2xl text-lg font-bold text-center cursor-pointer shadow-lg hover:-translate-y-1 transition-transform">
          Online migraine parameter recording
        </div>
      </div>

      {/* CLINICAL SNAPSHOT */}
      <section className="clinical-snapshot max-w-[1200px] mx-auto mt-12 mb-12 p-7 rounded-2xl bg-linear-to-br from-white to-[#f5f8ff] shadow-xl w-full px-6">
        <h3 className="text-xl font-bold mb-1">Clinical Snapshot</h3>
        <p className="snapshot-subtitle text-sm text-slate-500 mb-7">Visual overview of headache severity</p>

        <div className="test-tube-container flex justify-center items-end gap-14 flex-wrap mt-8">

          {/* Tube 1 */}
          <div className="tube-card w-[140px] text-center">
            <div className="tube relative h-[220px] w-[60px] mx-auto mb-3.5 bg-gray-200 rounded-b-[30px] overflow-hidden shadow-[inset_0_0_0_4px_#cbd5e1]">
              <div className="liquid vas absolute bottom-0 w-full rounded-b-[26px] animate-[fillUp_1.4s_ease-out_forwards] h-[68%] bg-linear-to-b from-[#ff9800] to-[#ff5722]"></div>
            </div>
            <div className="tube-label">
              <strong className="block text-sm font-semibold">VAS Score</strong>
              <span className="text-xs text-slate-600">6.8 / 10</span>
            </div>
          </div>

          {/* Tube 2 */}
          <div className="tube-card w-[140px] text-center">
            <div className="tube relative h-[220px] w-[60px] mx-auto mb-3.5 bg-gray-200 rounded-b-[30px] overflow-hidden shadow-[inset_0_0_0_4px_#cbd5e1]">
              <div className="liquid frequency absolute bottom-0 w-full rounded-b-[26px] animate-[fillUp_1.4s_ease-out_forwards] h-[55%] bg-linear-to-b from-[#4caf50] to-[#2e7d32]"></div>
            </div>
            <div className="tube-label">
              <strong className="block text-sm font-semibold">Monthly Frequency</strong>
              <span className="text-xs text-slate-600">14 days</span>
            </div>
          </div>

          {/* Tube 3 */}
          <div className="tube-card w-[140px] text-center">
            <div className="tube relative h-[220px] w-[60px] mx-auto mb-3.5 bg-gray-200 rounded-b-[30px] overflow-hidden shadow-[inset_0_0_0_4px_#cbd5e1]">
              <div className="liquid migraine absolute bottom-0 w-full rounded-b-[26px] animate-[fillUp_1.4s_ease-out_forwards] h-[62%] bg-linear-to-b from-[#3f51b5] to-[#673ab7]"></div>
            </div>
            <div className="tube-label">
              <strong className="block text-sm font-semibold">Migraine Burden</strong>
              <span className="text-xs text-slate-600">62%</span>
            </div>
          </div>

        </div>
      </section>

      <footer className="p-4 text-center text-xs text-[#666] mt-auto">
        ©️ Headache Registry Project
      </footer>
    </div>
  );
}
