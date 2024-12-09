"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import InfoCard from "@/components/InfoCard";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function NotFound() {
  // check for slug in local storage
  const slugRef = useRef<string | null>(null);
  // check if role exists in cookie
  const role = Cookies.get("role");
  const router = useRouter();

  useEffect(() => {
    slugRef.current = localStorage.getItem("restaurant");
  }, []);

  const handleClick = () => {
    console.log(slugRef.current);

    role === "owner"
      ? router.push(`/${slugRef.current}/owner`)
      : router.push(`/${slugRef.current}/user/menu`);
  };
  return (
    <div>
      {slugRef ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 px-4">
          <Image src="/not-found.svg" alt="404" width={500} height={500} />
          <p className="text-xl text-gray-600 mb-8 text-center">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
          <Button onClick={handleClick}>Return to Home</Button>
        </div>
      ) : (
        <InfoCard
          info="Info"
          message="I think we lost the restaurant you were on Please rescan QR Code to find your restaurant"
        />
      )}
    </div>
  );
}
