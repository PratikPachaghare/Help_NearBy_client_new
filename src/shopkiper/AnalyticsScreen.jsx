// 1. ANALYTICS COMPONENT
import React, { useState, useEffect } from 'react';

export const AnalyticsScreen = ({ products, orders }) => {
  // Logic: Calculate total revenue and top selling product
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const topProduct = [...products].sort((a, b) => b.sold - a.sold)[0];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📊 Business Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Total Revenue (Monthly)</h3>
          <p className="text-2xl font-bold">₹{totalRevenue}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg shadow">
          <h3 className="text-gray-600">Top Selling Product</h3>
          <p className="text-xl font-bold">{topProduct?.name || 'N/A'}</p>
          <small>Sold: {topProduct?.sold} units</small>
        </div>
      </div>
    </div>
  );
};