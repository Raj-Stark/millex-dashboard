export interface Order {
  _id: string;
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: {
    name: string;
    image: string;
    price: number;
    amount: number;
    product: string;
    _id: string;
  }[];
  status: string;
  user: string;
  createdAt: string;
}
