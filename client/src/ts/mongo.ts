export type MongoUser = {
  _id?: string;
  name: string;
  age: number;
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

export type MongoTimeTable = {
  _id?: string;
  title: string;
  type: string;
  courseCode: string;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  createdBy: string;
  createdAt?: string;
};

export type AuthUser = {
  _id?: string;
  username: string;
  roles?: string[];
  role?: string[] | string;
  createdAt?: string;
};

export type Role = {
  _id?: string;
  name: string;
  createdAt?: string;
};

export type MongoKuppiSession = {
  _id?: string;
  title: string;
  description: string;
  subject: string;
  date: string;
  time: string;
  teamsLink: string;
  createdBy: string;
  status: string;
  createdAt?: string;
};

