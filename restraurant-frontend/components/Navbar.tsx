"use client";

import Link from "next/link";
import React from "react";
import { Menu, ShoppingBag } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartSidebar from "./CartSidebar";
import { useRestaurantContext } from "@/context/restaurant-context";
import Loader from "./Loader";
import { useParams } from "next/navigation";

const Navbar = () => {
  const { slug } = useParams();
  const { restaurantData, isRestaurantLoading } = useRestaurantContext();

  const NavItems = () => (
    <>
      <Link
        href={`/${slug}/user/menu`}
        className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
      >
        Menu
      </Link>
      <Link
        href={`/${slug}/user/about`}
        className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
      >
        About
      </Link>
    </>
  );

  if (isRestaurantLoading) {
    return <Loader info="" />;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl text-gray-900">
              {restaurantData?.name}
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavItems />
            <CartSidebar />
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <CartSidebar />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[200px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;