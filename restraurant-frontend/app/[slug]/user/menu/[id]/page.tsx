"use client";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function ItemPage() {
  const { id }: { id: string } = useParams();
  const menuItems = [
    {
      id: 1,
      name: "Butter Chicken",
      description: "Tender chicken in a rich, creamy tomato sauce",
      price: 200,
    },
    {
      id: 2,
      name: "Palak Paneer",
      description: "Cottage cheese cubes in a spinach gravy",
      price: 150,
    },
    {
      id: 3,
      name: "Biryani",
      description:
        "Fragrant basmati rice with aromatic spices and meat or vegetables",
      price: 200,
    },
    {
      id: 4,
      name: "Tandoori Roti",
      description: "Whole wheat flatbread baked in a tandoor",
      price: 20,
    },
    {
      id: 5,
      name: "Malai Kofta",
      description: "Fried dumplings of potato and paneer in a creamy sauce",
      price: 300,
    },
    {
      id: 6,
      name: "Gulab Jamun",
      description: "Sweet milk solid balls soaked in rose-flavored syrup",
      price: 30,
    },
  ];

  const item: Item =
    menuItems.find((item) => item.id === parseInt(id)) || menuItems[6];
  return (
    <div className="flex flex-col bg-orange-50 pb-8">
      <main className="flex-grow container mx-auto py-8 px-4 pt-24">
        <Button
          variant="ghost"
          asChild
          className="mb-4 text-orange-700 hover:text-orange-800 hover:bg-orange-100"
        >
          <Link href="/menu">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Link>
        </Button>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Image
              src={"/hero.jpg"}
              alt="Butter Chicken"
              width="500"
              height="400"
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-orange-800">
              {item?.name}
            </h1>
            <p className="text-gray-700 mb-4">{item?.description}</p>
            <p className="text-2xl font-bold mb-4 text-orange-700">
              ₹ {item?.price}
            </p>
            <Button className="w-full mb-4 bg-orange-500 hover:bg-orange-600">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
