import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { isLogin, user, isLoading } = useAuth();

  // ১. লোডিং স্টেট হ্যান্ডেল করা
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // ২. লগইন করা না থাকলে লগইন পেজে পাঠানো
  if (!isLogin) return <Navigate to="/login" replace />;

  // ৩. রোল ভেরিফিকেশন
  if (role && user.role?.toUpperCase() !== role.toUpperCase()) {
    // যদি সে অন্য কোনো রোলের পেজে ঢুকতে চায়, তাকে তার ড্যাশবোর্ডে পাঠিয়ে দিন
    // যেমন: কিচেন স্টাফকে ভুলে সেলসম্যান পেজে ঢুকতে দিলে তার নিজের পেজে রিডাইরেক্ট হবে
    const redirectPath = user.role?.toUpperCase() === "ADMIN" ? "/admin" : 
                         user.role?.toUpperCase() === "SALESMAN" ? "/salesman" : 
                         user.role?.toUpperCase() === "KITCHEN" ? "/kitchen" : "/";
                         
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;