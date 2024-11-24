"use client";
import LoginPage from "@/components/Login";
// Auth context
import { useAuthContext } from "@/context/auth-context";
// next
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import AdminLayout from "../page";

const OwnerLogin = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const { slug } = useParams();

  if (user) {
    router.push(`/${slug}/owner/analytics`);
  }
  return (
    <AdminLayout>
      <LoginPage role="Owner" />;
    </AdminLayout>
  );
};

export default OwnerLogin;
