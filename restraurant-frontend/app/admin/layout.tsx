"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart,
  PlusCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { useRestaurantContext } from "@/context/restaurant-context";
import { AuthProvider, useAuthContext } from "@/context/auth-context";

const Sidebar = ({
  className,
  collapsed,
  setSidebarOpen,
}: {
  className?: string;
  collapsed: boolean;
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthContext();

  const navItems = [
    { href: "/admin/analysis", label: "Analysis", icon: BarChart },
    { href: "/admin/restaurants", label: "Restaurants", icon: List },
    {
      href: "/admin/add_restaurant",
      label: "Add Restaurant",
      icon: PlusCircle,
    },
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
      router.push(`/admin/`);
    }
  };
  return (
    <div
      className={`${className} h-screen bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out z-50 flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        <div className="p-4">
          <h1
            className={`text-2xl pt-4 font-bold mb-6 overflow-hidden transition-all duration-300 ease-in-out text-nowrap ${
              collapsed ? "w-0 h-12" : "w-full"
            }`}
          >
            Admin Panel
          </h1>
        </div>
        {/* Side bar menu items */}
        {isAuthenticated && (
          <nav className="flex-grow">
            <ul className={`${collapsed ? "" : "space-y-2"} px-2 w-full`}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={`flex items-center justify-center ${
                            collapsed ? "" : "space-x-2"
                          } p-2 rounded hover:bg-gray-800 transition-colors ${
                            pathname === item.href
                              ? "bg-gray-800 text-orange-500"
                              : ""
                          }`}
                          onClick={() => {
                            if (setSidebarOpen) {
                              setSidebarOpen(false);
                            }
                          }}
                        >
                          <item.icon size={24} />
                          <span
                            className={`transition-all duration-300 ease-in-out ${
                              collapsed ? "w-0 opacity-0" : "w-full opacity-100"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="mt-auto p-4 flex flex-col items-center space-y-4">
        {isAuthenticated && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full flex items-center justify-center p-2`}
                  onClick={handleLogout}
                >
                  <LogOut size={24} />
                  <span
                    className={`transition-all duration-300 ease-in-out text-left ${
                      collapsed ? "w-0 opacity-0" : "w-full opacity-100 ml-2"
                    }`}
                  >
                    Logout
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className="relative w-full h-20">
          <Image
            src={
              collapsed ? "/TableLync logo.png" : "/TableLync logo Light.png"
            }
            alt="Restaurant Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { restaurantData } = useRestaurantContext();
  const pathname = usePathname();

  useEffect(() => {
    localStorage.setItem("pathname", pathname);
  }, [pathname]);

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Desktop sidebar */}
        <Sidebar className="hidden md:flex" collapsed={sidebarCollapsed} />

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="md:hidden p-2 absolute right-4 top-4 z-50"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 bg-gray-900 text-gray-100 w-64"
          >
            <Sidebar collapsed={false} setSidebarOpen={setSidebarOpen} />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden z-[49]">
          <header className="bg-white shadow-md p-4 pt-7 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800 ml-4">
              {restaurantData?.name}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={24} />
              ) : (
                <ChevronLeft size={24} />
              )}
            </Button>
          </header>
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
      <Toaster />
    </AuthProvider>
  );
}
