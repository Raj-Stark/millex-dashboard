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
          <DialogTitle>Order Details {order._id}</DialogTitle>
          <DialogDescription>
            Created on {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Customer</h3>
            <p>
              <span className="font-semibold px-2">Name: </span>
              {order.user.name}
            </p>
            <p>
              {" "}
              <span className="font-semibold px-2">Email: </span>
              {order.user.email}
            </p>
            <p>
              {" "}
              <span className="font-semibold px-2">Phone no: </span>
              {order.user.phone}
            </p>
            <p>
              {" "}
              <span className="font-semibold px-2">City: </span>
              {order.user.address.city}
            </p>
            <p>
              {" "}
              <span className="font-semibold px-2">Counrty: </span>
              {order.user.address.country}
            </p>
            <p>
              {" "}
              <span className="font-semibold px-2">State: </span>
              {order.user.address.state}
            </p>
            <p>
              {" "}
              <span className="font-semibold px-2">Zip: </span>
              {order.user.address.zip}
            </p>
          </div>

          <div>
            <h3 className="font-medium">Items</h3>
            <div className="space-y-2">
              {order.orderItems.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between">
                    <span>
                      {item.name} × {item.amount}
                    </span>
                    <span>₹{(item.price * item.amount).toFixed(2)}</span>
                  </div>
                  <div key={index} className="flex flex-col justify-between">
                    <span className="font-semibold mt-2">MetaData</span>
                    <span>
                      {item.metaData && JSON.stringify(item.metaData)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping fee</span>
              <span>₹{order.shippingFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{order.tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between border-t pt-2">
            <span className="font-medium">Total</span>
            <span className="font-medium">₹{order.total.toFixed(2)}</span>
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
