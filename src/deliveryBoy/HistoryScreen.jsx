import React from 'react';

export const HistoryScreen = ({ history, totalEarnings }) => (
  <div className="p-4 pb-20">
    {/* EARNINGS CARD */}
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
      <p className="text-gray-400 text-sm">Total Earnings</p>
      <h1 className="text-4xl font-bold mt-1">₹{totalEarnings}</h1>
      <div className="mt-4 flex gap-3 text-sm">
        <div className="bg-gray-800 px-3 py-1 rounded border border-gray-700">Today: ₹{totalEarnings}</div>
        <div className="bg-green-900 text-green-300 px-3 py-1 rounded border border-green-800">Bonus: +₹50</div>
      </div>
    </div>

    {/* WEEKLY CHART (Simple Visual) */}
    <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
      <h3 className="font-bold text-gray-700 mb-4 text-sm">WEEKLY ACTIVITY</h3>
      <div className="flex items-end justify-between h-24 gap-2">
        {[200, 450, 120, 300, 500, 100, totalEarnings].map((amt, i) => (
           <div key={i} className="w-full flex flex-col items-center gap-1">
              <div style={{height: `${Math.min(amt/5, 100)}%`}} className={`w-full rounded-t ${i === 6 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <span className="text-[10px] text-gray-400">{['M','T','W','T','F','S','S'][i]}</span>
           </div>
        ))}
      </div>
    </div>

    {/* LIST */}
    <h3 className="font-bold text-lg mb-3">Recent Deliveries</h3>
    <div className="space-y-3">
      {history.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-100">
          <div>
            <p className="font-bold text-gray-800">Order #{item.id}</p>
            <p className="text-xs text-gray-500">{item.date} • {item.status}</p>
          </div>
          <div className="text-right">
            <p className="text-green-600 font-bold text-lg">+ ₹{item.amount}</p>
            {item.tip > 0 && <p className="text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded inline-block">Inc. ₹{item.tip} tip</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);