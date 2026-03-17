import React from 'react';

export const AnalyticsScreen = ({ analytics }) => {
  const totals = analytics?.totals || { grossSales: 0, totalOrders: 0, avgOrderValue: 0 };
  const timeline = analytics?.timeline || [];
  const maxSales = Math.max(...timeline.map((t) => t.sales || 0), 1);

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <p className="text-slate-500 text-sm">Gross Sales</p>
          <p className="text-3xl font-black text-slate-900">Rs {Math.round(totals.grossSales || 0)}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <p className="text-slate-500 text-sm">Orders Count</p>
          <p className="text-3xl font-black text-slate-900">{totals.totalOrders || 0}</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <p className="text-slate-500 text-sm">Average Order Value</p>
          <p className="text-3xl font-black text-slate-900">Rs {Math.round(totals.avgOrderValue || 0)}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
        <h3 className="font-bold mb-3 text-slate-900">Sales Trend</h3>
        <div className="h-64 grid grid-cols-1">
          <div className="h-full flex items-end gap-2">
            {timeline.map((row) => {
              const h = Math.max(8, Math.round((row.sales / maxSales) * 100));
              return (
                <div key={row._id} className="flex-1 flex flex-col items-center justify-end">
                  <div title={`Rs ${Math.round(row.sales)} | ${row.orders} orders`} className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-slate-500 mt-2 text-center">{row._id}</span>
                </div>
              );
            })}
            {!timeline.length && <p className="text-sm text-slate-500">No analytics data available for selected period.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};