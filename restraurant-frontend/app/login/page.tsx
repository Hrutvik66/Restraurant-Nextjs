"use client";
import Loader from "@/components/Loader";
import LoginPage from "@/components/Login";
// Auth context
import { useAuthContext } from "@/context/auth-context";
// next
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const { isAuthenticated, isAuthLoading } = useAuthContext();
  const router = useRouter();

  if (isAuthLoading) {
    return <Loader info="Authenticating..." />;
  }

  if (isAuthenticated) {
    let last_visted = localStorage.getItem("pathname") ?? `/admin/analysis`;
    if (last_visted === `/admin`) {
      last_visted = `/admin/analysis`;
      localStorage.setItem("pathname", last_visted);
    }
    router.push(last_visted);
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-100">
      <LoginPage role="" />
    </div>
  );
};

export default AdminLogin;
