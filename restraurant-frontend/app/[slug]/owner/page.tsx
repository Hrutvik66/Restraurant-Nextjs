"use client";
import Loader from "@/components/Loader";
import LoginPage from "@/components/Login";
// Auth context
import { useAuthContext } from "@/context/auth-context";
// next
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const OwnerLogin = () => {
  const { isAuthenticated, isAuthLoading } = useAuthContext();
  const router = useRouter();
  const { slug } = useParams();

  if (isAuthLoading) {
    return <Loader info="Authenticating..." />;
  }

  if (isAuthenticated) {
    let last_visted =
      localStorage.getItem("pathname") ?? `/${slug}/owner/analytics`;
    if (last_visted === `/${slug}/owner`) {
      last_visted = `/${slug}/owner/analytics`;
      localStorage.setItem("pathname", last_visted);
    }
    router.push(last_visted);
  }
  return (
    <div>
      <LoginPage role="Owner" />;
    </div>
  );
};

export default OwnerLogin;
