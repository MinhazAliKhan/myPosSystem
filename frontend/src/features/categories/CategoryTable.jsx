import React from "react";

const CategoryTable = ({ categories, onEdit, onDelete, userRole }) => {
  // যদি কোনো ডাটা না থাকে
  if (categories.length === 0) return <p className="text-center py-4 bg-white rounded shadow">No categories found.</p>;

  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Description</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-50 transition">
              <td className="p-3 font-medium">{category.name}</td>
              <td className="p-3 text-sm text-gray-600">{category.description || "-"}</td>
              <td className="p-3 text-center">
                {/* ব্র্যান্ডের মতো স্ট্যাটাস ডিজাইন */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${category.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {category.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </td>
              <td className="p-3 text-center">
                {/* এডিট বাটন সবার জন্য */}
                <button 
                  onClick={() => onEdit(category)} 
                  className="text-blue-600 hover:underline mr-3 text-sm font-semibold"
                >
                  Edit
                </button>
                
                {/* ডিলিট বাটন শুধুমাত্র ADMIN এর জন্য */}
                {userRole === "ADMIN" && (
                  <button 
                    onClick={() => onDelete(category._id)} 
                    className="text-red-600 hover:underline text-sm font-semibold"
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

export default CategoryTable;