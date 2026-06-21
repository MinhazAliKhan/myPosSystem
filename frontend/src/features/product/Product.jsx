import React, { useState, useEffect } from "react";
import productApi from "../../api/product.service";
import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import { useAuth } from "../../store/AuthContext";
import { toast } from "react-hot-toast";

const Product = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ফিল্টার ও সর্টিং স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 4;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, minPrice, maxPrice, sortBy, sortOrder,status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let booleanStatus = undefined;
      if (status === "true") booleanStatus = true;
      if (status === "false") booleanStatus = false;
      
      const params = { 
        page: currentPage, 
        limit, 
        search: searchTerm,
        minPrice: minPrice || undefined, // ফিক্সড: খালি থাকলে যেন এরর না হয়
        maxPrice: maxPrice || undefined, // ফিক্সড: খালি থাকলে যেন এরর না হয়
        isActive: booleanStatus,
        sortBy,
        sortOrder
      };
      const response = await productApi.getAllProducts(params);
      setProducts(response.data.data);
      setTotalProducts(response.data.meta.total);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await productApi.createProduct(data);
      toast.success("Product created!");
      fetchProducts();
    } catch (err) { 
      toast.error(err.response?.data?.message || "Create failed"); 
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await productApi.updateProduct(id, data);
      toast.success("Product updated!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) { 
      toast.error("Update failed"); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await productApi.deleteProduct(id);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) { 
      toast.error("Delete failed"); 
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Total Number of Products ({totalProducts})</h2>

      {/* ফিল্টার, সার্চ ও সর্টিং বার - রেসপন্সিভ করা হয়েছে */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-center">
        <input type="text" placeholder="Search..." className="p-2 border rounded outline-none focus:ring-2 w-full" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} />
        <input type="number" placeholder="Min Price" className="p-2 border rounded outline-none focus:ring-2 w-full" value={minPrice} onChange={(e) => {setMinPrice(e.target.value);setCurrentPage(1);}} />
        <input type="number" placeholder="Max Price" className="p-2 border rounded outline-none focus:ring-2 w-full" value={maxPrice} onChange={(e) => {setMaxPrice(e.target.value);setCurrentPage(1);}} />
        
        <select className="p-2 border rounded outline-none focus:ring-2 w-full" value={sortBy} onChange={(e) => {setSortBy(e.target.value); setCurrentPage(1);}}>
          <option value="createdAt">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
        </select>
        
        <select className="p-2 border rounded outline-none focus:ring-2 w-full" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <select
            value={status}
            onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
        </select>
      </div>

      <ProductForm 
        onCreate={handleCreate} 
        onUpdate={handleUpdate} 
        editingProduct={editingProduct} 
        clearEdit={() => setEditingProduct(null)} 
      />

      {loading ? (
        <p className="text-center py-10">Loading Products...</p>
      ) : (
        <>
          {/* টেবিল রেসপন্সিভ করতে ProductTable এর কোডে নিচের <div className="overflow-x-auto"> যোগ করবেন */}
          <div className="overflow-x-auto">
             <ProductTable products={products} onEdit={setEditingProduct} onDelete={handleDelete} userRole={user?.role} />
          </div>
          
          <div className="flex justify-center mt-6 gap-4 items-center">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-1 border rounded disabled:opacity-50">Prev</button>
            <span className="text-sm font-medium">Page {currentPage} of {Math.ceil(totalProducts / limit) || 1}</span>
            <button disabled={currentPage >= Math.ceil(totalProducts / limit)} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Product;