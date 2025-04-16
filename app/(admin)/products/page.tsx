import React from "react";
import ProductCard from "@/components/product-card";

function page() {
  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard />
    </div>
  );
}

export default page;
