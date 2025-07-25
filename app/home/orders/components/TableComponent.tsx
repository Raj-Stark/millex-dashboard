import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/app/types/order";
import { Badge } from "@/components/ui/badge";
import { OrderDetailDialog } from "./OrderDetailDialog";
import { formatDate } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TableComponentProps {
  orders: Order[];
  onRowClick: (id: string) => void;
}

const ITEMS_PER_PAGE = 15;

export default function TableComponent({ orders }: TableComponentProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
            {paginatedOrders?.map((order) => (
              <TableRow
                key={order._id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRowClick(order)}
              >
                <TableCell className="font-medium">{order._id}</TableCell>
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
                  ₹{order.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter className="bg-gray-100">
            <TableRow>
              <TableCell colSpan={4} className="text-right font-medium">
                Total
              </TableCell>
              <TableCell className="text-right font-medium">
                ₹{totalAmount.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={goToPreviousPage}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem className="px-3 flex items-center text-sm">
              Page {currentPage} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={goToNextPage}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
