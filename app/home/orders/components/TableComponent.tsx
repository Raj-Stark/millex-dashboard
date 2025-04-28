import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/app/types/order";
import { Badge } from "@/components/ui/badge";
import { OrderDetailDialog } from "./OrderDetailDialog";
import { formatDate } from "@/lib/utils";

interface TableComponentProps {
  orders: Order[];
}

export default function TableComponent({ orders }: TableComponentProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalAmount = orders?.reduce((sum, order) => sum + order.total, 0) || 0;

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption className="text-left p-2 bg-gray-50">
            A list of your recent orders. Click on any row to view details.
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow
                key={order._id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(order)}
              >
                <TableCell className="font-medium">
                  #{order._id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {order.orderItems.slice(0, 2).map((item, index) => (
                      <span key={index} className="truncate max-w-[200px]">
                        {item.name} ({item.amount})
                      </span>
                    ))}
                    {order.orderItems.length > 2 && (
                      <span className="text-gray-500">
                        +{order.orderItems.length - 2} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "processing"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{(order.total / 100).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-gray-100">
            <TableRow>
              <TableCell colSpan={4} className="text-right font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-medium">
                ₹{(totalAmount / 100).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
