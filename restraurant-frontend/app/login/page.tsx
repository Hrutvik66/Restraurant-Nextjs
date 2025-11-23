"use client";
import Loader from "@/components/Loader";
import LoginPage from "@/components/Login";
// Auth context
import { useAuthContext } from "@/context/auth-context";
// next
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Login = () => {
  const { isAuthenticated, isAuthLoading, user } = useAuthContext();
  const router = useRouter();

  // Handle authentication redirect in useEffect to prevent setState during render
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user?.role;
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin/restaurants");
        } else if (role === "owner") {
          router.push(`/${user?.owner?.restaurant.slug}/owner/analytics`);
        }
      }, 0);
    }
  }, [isAuthenticated, user, router]);

  if (isAuthLoading) {
    return <Loader info="Authenticating..." />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-orange-100">
        <LoginPage />
      </div>
    );
  }

  // Show loading while redirecting
  return <Loader info="Redirecting..." />;
};

export default Login;
