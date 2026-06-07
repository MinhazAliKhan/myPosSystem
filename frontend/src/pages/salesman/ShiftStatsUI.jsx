import React, { useState } from "react";
import { Link } from "react-router-dom";

const ShiftStatsUI = ({ shift, onFinish }) => {
  const [closingData, setClosingData] = useState({ actualCashInDrawer: "", bagNumber: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinish({
      actualCashInDrawer: Number(closingData.actualCashInDrawer),
      bagNumber: closingData.bagNumber
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg border border-green-200 flex justify-between items-center">
        <div>
          <p className="text-green-700 font-bold text-lg">Shift Active</p>
          <p className="text-xs text-green-600">Started at: {new Date(shift.openedAt).toLocaleTimeString()}</p>
        </div>
        <Link to="/salesman/new-order" className="bg-green-600 text-white px-4 py-2 rounded font-bold">
           Go to POS
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-gray-700 font-bold mb-4 border-b pb-2">Close Register (End Day)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Actual Cash in Drawer</label>
            <input 
              type="number"
              className="w-full p-2 border rounded outline-none focus:border-red-500"
              placeholder="How much cash do you have right now?"
              value={closingData.actualCashInDrawer}
              onChange={(e) => setClosingData({...closingData, actualCashInDrawer: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1 uppercase">Money Bag Number</label>
            <input 
              type="text"
              className="w-full p-2 border rounded outline-none focus:border-red-500"
              placeholder="Enter bag/seal number"
              value={closingData.bagNumber}
              onChange={(e) => setClosingData({...closingData, bagNumber: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded font-bold hover:bg-black">
            CLOSE & DEPOSIT CASH
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShiftStatsUI;