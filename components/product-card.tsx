"use client"; // because you're using client-side data mapping

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

function ProductCard() {
  const data = [
    {
      id: "1",
      imgSrc: "/farmgear.png",
      title: "Premium Farm Tools",
      desc: "Top-notch quality tools for efficient farming operations. Built to last, easy to handle.",
    },
    {
      id: "2",
      imgSrc: "/file.svg",
      title: "Agri Insights Reports",
      desc: "In-depth reports on crop yield, weather patterns, and market trends in agriculture.",
    },
    {
      id: "2",
      imgSrc: "/file.svg",
      title: "Agri Insights Reports",
      desc: "In-depth reports on crop yield, weather patterns, and market trends in agriculture.",
    },
    {
      id: "2",
      imgSrc: "/file.svg",
      title: "Agri Insights Reports",
      desc: "In-depth reports on crop yield, weather patterns, and market trends in agriculture.",
    },
    {
      id: "2",
      imgSrc: "/file.svg",
      title: "Agri Insights Reports",
      desc: "In-depth reports on crop yield, weather patterns, and market trends in agriculture.",
    },
    {
      id: "2",
      imgSrc: "/file.svg",
      title: "Agri Insights Reports",
      desc: "In-depth reports on crop yield, weather patterns, and market trends in agriculture.",
    },
  ];

  return (
    <>
      {data.map((item, index) => (
        <Card key={index} className="hover:shadow-xl transition-all gap-0.5">
          <CardHeader className="p-0">
            <Image
              src={item.imgSrc}
              alt={item.title}
              width={500}
              height={300}
              className="w-full h-48 object-contain"
            />
          </CardHeader>

          <CardContent className="p-4">
            <CardTitle className="text-lg font-semibold">
              {item.title}
            </CardTitle>
            <CardDescription className="text-sm mt-2 text-muted-foreground">
              {item.desc.split(" ").slice(0, 20).join(" ") + "..."}
            </CardDescription>
          </CardContent>

          <CardFooter className=" border-t gap-3 p-4  ">
            <Button className="bg-green-600 hover:bg-green-500">Edit</Button>
            <Button className="bg-red-600 hover:bg-red-500">Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

export default ProductCard;
