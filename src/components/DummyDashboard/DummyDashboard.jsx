import Image from 'next/image';

export function DummyDashboard() {
  return (
    <div className="bg-[#0d0d0f] p-6 rounded-lg border border-white/10 max-w-2xl mx-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm text-gray-400">Applications</p>
              <p className="text-xl font-bold text-white">24</p>
            </div>
          </div>
        </div>
        <div className="bg-[#f02e65]/10 border border-[#f02e65]/30 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔮</span>
            <div>
              <p className="text-sm text-gray-400">Response Rate</p>
              <p className="text-xl font-bold text-[#f02e65]">85%</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm text-gray-400">Optimized</p>
              <p className="text-xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fake Table */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-gray-300">
          <thead className="bg-[#1a1a1a]">
            <tr>
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">AI Chance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10 hover:bg-white/5">
              <td className="p-3">Google</td>
              <td className="p-3">Frontend Dev</td>
              <td className="p-3"><span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">Applied</span></td>
              <td className="p-3">
                <div className="flex items-center">
                  82%
                  <div className="ml-2 h-2 bg-[#f02e65]" style={{ width: '82%' }}></div>
                </div>
              </td>
            </tr>
            <tr className="border-b border-white/10 hover:bg-white/5">
              <td className="p-3">Amazon</td>
              <td className="p-3">Data Scientist</td>
              <td className="p-3"><span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">Interview</span></td>
              <td className="p-3">
                <div className="flex items-center">
                  78%
                  <div className="ml-2 h-2 bg-[#f02e65]" style={{ width: '78%' }}></div>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-white/5">
              <td className="p-3">Netflix</td>
              <td className="p-3">UX Designer</td>
              <td className="p-3"><span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Rejected</span></td>
              <td className="p-3">
                <div className="flex items-center">
                  65%
                  <div className="ml-2 h-2 bg-[#f02e65]" style={{ width: '65%' }}></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Profile Score */}
      <div className="mt-6 bg-[#1a1a1a] p-4 rounded-lg">
        <p className="text-gray-400 mb-2">Profile Score</p>
        <div className="flex items-center justify-between">
          <span className="text-[#f02e65] font-bold">87/100</span>
          <div className="w-full bg-[#0d0d0f] h-3 rounded-full ml-4 overflow-hidden">
            <div className="bg-gradient-to-r from-[#f02e65] to-[#ff7d9d] h-full" style={{ width: '87%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}