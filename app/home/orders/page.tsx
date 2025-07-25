"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import TableComponent from "./components/TableComponent";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();
  const {
    data: orders,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/get-order", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      return data.orders.reverse();
    },
  });

  if (isLoading) return <Spinner />;

  if (isError) return <p className="px-5 py-5">{(error as Error).message}</p>;

  const handleRowClick = (orderId: string) => {
    router.push(`/home/orders/${orderId}`);
  };

  return (
    <div className="px-5 py-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">Order History</h2>
            <p className="text-gray-500">{orders?.length} orders placed.</p>
          </div>
        </div>

        <TableComponent orders={orders} onRowClick={handleRowClick} />
      </div>
    </div>
  );
}
