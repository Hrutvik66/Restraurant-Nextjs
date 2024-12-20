"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Utensils, TrendingUp, DollarSign, Menu, X, IndianRupee } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm relative">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            <Image
              src="/TableLync dark.svg"
              alt="Logo"
              width={150}
              height={75}
              className="w-auto h-8 sm:h-10"
            />
          </Link>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav
            className={`absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
              isMenuOpen ? "block" : "hidden"
            } md:block z-50`}
          >
            <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-4 md:p-0">
              <li>
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-600 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 w-full md:w-[6rem]"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-orange-50 py-12 sm:py-20 min-h-[calc(100vh-4rem)] flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Streamline Your Restaurant Management
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Boost efficiency, increase profits, and delight your customers
              with our all-in-one solution.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-12 sm:py-20 min-h-screen flex justify-center items-center"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Why Choose RestaurantPro?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: <Utensils className="h-8 w-8 text-orange-600" />,
                  title: "Menu Management",
                  description:
                    "Easily update and optimize your menu for maximum profitability.",
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
                  title: "Sales Analytics",
                  description:
                    "Gain valuable insights into your restaurant's performance.",
                },
                {
                  icon: <DollarSign className="h-8 w-8 text-orange-600" />,
                  title: "Online Ordering",
                  description:
                    "Seamlessly integrate online orders with your existing systems.",
                },
                {
                  icon: <IndianRupee className="h-8 w-8 text-orange-600" />,
                  title: "Payment Gateway Integration",
                  description:
                    "Accept payments from multiple sources with ease.",
                },
              ].map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg sm:text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-orange-50 py-12 sm:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Ready to Get Started?
            </h2>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Contact Us</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Fill out the form below and we'll be in touch soon.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your Name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <Link href="/" className="text-2xl font-bold">
                <Image
                  src="/TableLync logo Light.png"
                  alt="Logo"
                  width={150}
                  height={75}
                  className="w-auto h-8 sm:h-10"
                />
              </Link>
              <p className="mt-2 text-sm">
                Empowering restaurants to thrive in the digital age.
              </p>
            </div>
            <nav>
              <ul className="flex flex-wrap justify-center sm:space-x-4">
                <li className="mx-2 my-1">
                  <Link href="#" className="text-sm hover:text-orange-400">
                    Privacy Policy
                  </Link>
                </li>
                <li className="mx-2 my-1">
                  <Link href="#" className="text-sm hover:text-orange-400">
                    Terms of Service
                  </Link>
                </li>
                <li className="mx-2 my-1">
                  <Link href="#" className="text-sm hover:text-orange-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mt-8 text-center text-xs sm:text-sm">
            © {new Date().getFullYear()} TABLELYNC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}