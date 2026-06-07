import React from "react";

const UnitTable = ({ units, onEdit, onDelete, userRole }) => {
  if (units.length === 0) return <p className="text-center py-6 bg-white rounded shadow text-gray-500">No units found.</p>;

  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b">
          <tr className="text-gray-700 uppercase text-xs font-bold">
            <th className="p-3">Full Name</th>
            <th className="p-3">Short Name</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {units.map((unit) => (
            <tr key={unit._id} className="hover:bg-gray-50 transition border-b">
              <td className="p-3 font-semibold text-gray-800">{unit.name}</td>
              <td className="p-3 text-sm text-gray-600">{unit.shortName}</td>
              <td className="p-3 text-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${unit.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {unit.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              <td className="p-3 text-center">
                <button 
                  onClick={() => onEdit(unit)} 
                  className="text-blue-600 hover:text-blue-800 mr-4 text-sm font-semibold transition"
                >
                  Edit
                </button>
                {userRole === "ADMIN" && (
                  <button 
                    onClick={() => onDelete(unit._id)} 
                    className="text-red-600 hover:text-red-800 text-sm font-semibold transition"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UnitTable;