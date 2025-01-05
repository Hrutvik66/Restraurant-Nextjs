"use client";
import Loader from "@/components/Loader";
import LoginPage from "@/components/Login";
// Auth context
import { useAuthContext } from "@/context/auth-context";
// next
import { useRouter } from "next/navigation";

const Login = () => {
  const { isAuthenticated, isAuthLoading, user } = useAuthContext();
  const router = useRouter();

  if (isAuthLoading) {
    return <Loader info="Authenticating..." />;
  }

  // if user is already authenticated, redirect to admin dashboard if user is admin and owner dashboard if user is owner
  console.log("isAuthenticated", isAuthenticated);
  if (isAuthenticated) {
    const role = user?.role;
    if (role === "admin") {
      router.push("/admin/restaurants");
    } else if (role === "owner") {
      router.push(`/${user?.owner?.restaurant.slug}/owner/analytics`);
    }
  }
  return (
    <div className="min-h-screen flex justify-center items-center bg-orange-100">
      <LoginPage />
    </div>
  );
};

export default Login;
