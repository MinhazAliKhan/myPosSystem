import { useState } from "react";

export const usePOS = () => {
  const [cart, setCart] = useState([]);

  // প্রোডাক্ট কার্টে যোগ করা
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, productId: product._id }];
    });
  };

  // কার্ট থেকে রিমুভ করা
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // টোটাল ক্যালকুলেশন
  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  return { cart, addToCart, removeFromCart, totalAmount: calculateTotal(), setCart };
};