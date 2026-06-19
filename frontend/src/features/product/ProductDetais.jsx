import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productApi from '../../api/product.service';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await productApi.getProductById(id);
        if (response.data && response.data.data) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold">Loading Product...</div>;
  if (!product) return <div className="p-10 text-center text-red-500 font-bold">Product not found!</div>;

  return (
    <div className="p-4 md:p-12 bg-gray-100 min-h-screen">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .printable-card, .printable-card * { visibility: visible; }
          .printable-card { position: absolute; left: 0; top: 0; width: 100% !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* কার্ডটি মোবাইলে যেন পুরো জায়গা নেয় এবং স্ক্রিনে ফিট হয় */}
      <div className="printable-card max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-900 px-6 md:px-8 py-6 text-white flex justify-between items-center">
          <h1 className="text-lg font-medium tracking-wide uppercase">Product Information</h1>
          <span className="text-gray-400 text-sm">#{product.sku}</span>
        </div>

        <div className="px-6 md:px-8 py-8 space-y-6">
          {/* রেসপন্সিভ গ্রিড: মোবাইল হলে ১ কলাম, বড় হলে ২ কলাম */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Name</p>
              <p className="text-gray-900 font-semibold mt-1">{product.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Status</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${product.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Price</p>
              <p className="text-gray-900 font-medium mt-1 text-lg">$ {product.price}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Cost Price</p>
              <p className="text-gray-900 font-medium mt-1 text-lg">$ {product.costPrice}</p>
            </div>
          </div>

          {/* স্টক পার্টটি মোবাইলে নিচে নেমে যাবে */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-6">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Category</p>
              <p className="text-gray-700 text-sm mt-1">{product.category?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Brand</p>
              <p className="text-gray-700 text-sm mt-1">{product.brand?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Stock</p>
              <p className="text-gray-700 text-sm mt-1 font-medium">{product.stock} {product.unit?.shortName || ""}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase pt-6 border-t border-gray-100">
            <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
            <span>Ref: {product._id}</span>
          </div>

          <div className="no-print flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button onClick={() => navigate(-1)} className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-wider transition-colors">
              Cancel
            </button>
            <button onClick={() => window.print()} className="px-5 py-2 text-xs font-bold bg-gray-900 text-white hover:bg-black uppercase tracking-wider rounded transition-colors shadow-sm">
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;