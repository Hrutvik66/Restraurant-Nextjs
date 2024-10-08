"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-100 min-h-screen">
      <Navbar />
      <div className="container  mx-auto px-4 flex items-center justify-center h-[100vh]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-[100vw]">
          <motion.div
            className="flex flex-col space-y-8 lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
              It&apos;s not just <span className="text-red-600">Food</span>.
              <br />
              It&apos;s an <span className="text-red-600">Experience</span>
            </h1>
            <p className="text-xl text-gray-700">
              Indulge in a culinary journey that tantalizes your taste buds and
              creates unforgettable memories.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6"
              >
                <Link href="/menu">View Menu</Link>
              </Button>
              <Button
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-lg px-8 py-6"
              >
                <Link href="/Cart">Order Now</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                  {/* import image from public */}
                  <Image
                    src={`/hero.jpg`}
                    alt="Delicious food spread"
                    layout="fill"
                    objectFit="cover"
                    priority
                    className="hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
