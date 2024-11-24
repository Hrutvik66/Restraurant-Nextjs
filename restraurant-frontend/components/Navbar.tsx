"use client";

import Link from "next/link";
import React from "react";
import { HiMenu } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartSidebar from "./CartSidebar";
import { useRestaurantContext } from "@/context/restaurant-context";
import Loader from "./Loader";
import { useParams } from "next/navigation";

const Navbar = () => {
  const { slug } = useParams();
  const NavItems = () => (
    <>
      <Link
        href={`/${slug}/user/menu`}
        className="cursor-pointer hover:text  -red-700 font-semibold transition-colors duration-200"
      >
        Menu
      </Link>
      <Link
        href={`/${slug}/user/about`}
        className="cursor-pointer hover:text-red-700 font-semibold transition-colors duration-200"
      >
        About
      </Link>
      <div className="hidden md:block">
        <CartSidebar />
      </div>
    </>
  );

  const { restaurantData, isRestaurantLoading } = useRestaurantContext();

  if (isRestaurantLoading) {
    return <Loader info="" />;
  }

  return (
    <nav className="flex justify-between items-center p-4 md:p-[1rem_5rem] fixed w-full z-40 bg-white shadow-md font-abel">
      <Link href="/" className="font-bold text-2xl text-red-500">
        {restaurantData?.name}
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-16 items-center text-lg">
        <NavItems />
      </ul>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <HiMenu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[200px] sm:w-[300px]">
          <nav className="flex flex-col space-y-4 mt-8">
            <NavItems />
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
