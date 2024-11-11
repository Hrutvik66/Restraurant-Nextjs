"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  BarChart,
  PlusCircle,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
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

const Sidebar = ({
  className,
  collapsed,
}: {
  className?: string;
  collapsed: boolean;
}) => {
  const pathname = usePathname();
  const { slug } = useParams();

  const navItems = [
    { href: `/${slug}/owner/analytics`, label: "Analytics", icon: BarChart },
    {
      href: `/${slug}/owner/add-item`,
      label: "Add Food Item",
      icon: PlusCircle,
    },
    { href: `/${slug}/owner/orders`, label: "Orders", icon: Settings },
  ];

  return (
    <div
      className={`${className} h-screen bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out z-50 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <h1
          className={`text-2xl pt-4 font-bold mb-6 overflow-hidden transition-all duration-300 ease-in-out text-nowrap ${
            collapsed ? "w-0 h-12" : "w-full"
          }`}
        >
          Owner Panel
        </h1>
      </div>
      <nav>
        <ul className={`${collapsed ? "" : "space-y-2"} px-2`}>
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:block" collapsed={sidebarCollapsed} />

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
          <Sidebar collapsed={false} />
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
      <Toaster />
    </div>
  );
}
