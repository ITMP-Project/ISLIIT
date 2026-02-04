export type MongoUser = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
};

export type MongoProduct = {
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  createdAt?: string;
};

export type MongoComment = {
  _id?: string;
  productId: string;
  author: string;
  message: string;
  createdAt?: string;
};
