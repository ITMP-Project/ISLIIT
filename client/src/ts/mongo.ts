export type MongoUser = {
  _id?: string
  name: string
  age: number
  createdAt?: string
}

export type MongoProduct = {
  _id?: string
  name: string
  category: string
  price: number
  stock: number
  status: string
  createdAt?: string
}

export type MongoComment = {
  _id?: string
  productId: string
  author: string
  message: string
  createdAt?: string
}

export type MongoTimeTable = {
  _id?: string
  title: string
  type: string
  courseCode: string
  courseName: string
  date: string
  startTime: string
  endTime: string
  description: string
  createdBy: string
  createdAt?: string
}

export type AuthUser = {
  _id?: string
  username: string
  roles?: string[]
  role?: string[] | string
  createdAt?: string
  modules?: string[]
  email?: string
}

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
  year: string;
  semester: string;
  date: string;
  time: string;
  duration: string;
  teamsLink: string;
  createdBy: string;
  status: string;
  createdAt?: string;
};


export type Faculty = {
  _id?: string
  faculty_name: string
  createdAt?: string
}

export type Specialization = {
  _id?: string
  specialization_name: string
  faculty_id: string
  createdAt?: string
}

export type Module = {
  _id?: string
  module_name: string
  year: number
  semester: number
  specialization_id: string
  createdAt?: string
}

export type StudentRequest = {
  _id?: string
  username: string
  studentId?: string
  student_id?: string
  faculty_id: string
  specialization_id: string
  year: number
  semester: number
  module_ids?: string[]
  status?: string
  createdAt?: string
  updatedAt?: string
  approvedAt?: string
}

export type Student = {
  _id?: string
  username: string
  studentId?: string
  faculty_id: string
  specialization_id: string
  year: number
  semester: number
  createdAt?: string
  updatedAt?: string
}

export type ModuleEvent = {
  _id?: string
  module_id: string
  title: string
  type: "lec" | "lab" | "exam"
  startTime: string
  endTime: string
  description: string
  createdBy: string
  createdAt?: string
}
