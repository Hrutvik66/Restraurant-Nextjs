"use client";
import LoginPage from "@/components/Login";
// Auth context
import { useAuthContext } from "@/context/auth-context";
// next
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const OwnerLogin = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const { slug } = useParams();

  if (user) {
    router.push(`/${slug}/owner/analytics`);
  }
  return (
    <div>
      <LoginPage role="Owner" />;
    </div>
  );
};

export default OwnerLogin;
