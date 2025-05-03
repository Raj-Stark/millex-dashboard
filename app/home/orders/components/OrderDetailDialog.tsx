import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/app/types/order";
import { formatDate } from "@/lib/utils";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Order Details #{order._id.slice(-6).toUpperCase()}
          </DialogTitle>
          <DialogDescription>
            Created on {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Customer</h3>
            {/* <p>{order.customer.name}</p>
            <p>{order.customer.email}</p> */}
          </div>

          <div>
            <h3 className="font-medium">Items</h3>
            <div className="space-y-2">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.name} × {item.amount}
                  </span>
                  <span>₹{((item.price * item.amount) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Total</span>
            <span className="font-medium">
              ₹{(order.total / 100).toFixed(2)}
            </span>
          </div>

          <div>
            <h3 className="font-medium">Status</h3>
            <p>{order.status}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
