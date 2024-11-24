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
    router.push(`/admin/restaurants`);
  }
  return (
    <div>
      <LoginPage role="Admin" />;
    </div>
  );
};

export default AdminLogin;
