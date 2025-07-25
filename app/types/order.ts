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
    metaData: object;
    _id: string;
  }[];
  status: string;
  user: {
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}
