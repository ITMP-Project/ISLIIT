import "dotenv/config";
import { getDb, closeDb } from "./src/config/db.mjs";

const users = [
  {
    name: "Ava Johnson",
    email: "ava@example.com",
    password: "password123",
    createdAt: new Date("2026-01-05"),
  },
  {
    name: "Noah Smith",
    email: "noah@example.com",
    password: "secret456",
    createdAt: new Date("2026-01-12"),
  },
  {
    name: "Mia Rodriguez",
    email: "mia@example.com",
    password: "welcome789",
    createdAt: new Date("2026-01-18"),
  },
];

const products = [
  {
    name: "Wireless Mouse",
    category: "Accessories",
    price: 24.99,
    stock: 120,
    status: "Active",
    createdAt: new Date("2026-01-05"),
  },
  {
    name: "Mechanical Keyboard",
    category: "Accessories",
    price: 89.0,
    stock: 45,
    status: "Active",
    createdAt: new Date("2026-01-12"),
  },
  {
    name: "27in Monitor",
    category: "Displays",
    price: 219.99,
    stock: 30,
    status: "Backorder",
    createdAt: new Date("2026-01-18"),
  },
  {
    name: "USB-C Dock",
    category: "Accessories",
    price: 129.0,
    stock: 18,
    status: "Inactive",
    createdAt: new Date("2026-01-20"),
  },
  {
    name: "Ergonomic Chair",
    category: "Furniture",
    price: 349.0,
    stock: 12,
    status: "Active",
    createdAt: new Date("2026-01-28"),
  },
];

const timeTables = [
  {
    title: "Assignment 1 Submission",
    type: "assignment",
    courseCode: "IT3030",
    courseName: "Web Engineering",
    date: "2026-03-18",
    startTime: "00:00",
    endTime: "23:59",
    description: "Submit via LMS",
    createdBy: "admin",
    createdAt: new Date("2026-02-06"),
  },
];

const run = async () => {
  const db = await getDb();

  await db.collection("users").deleteMany({});
  await db.collection("products").deleteMany({});
  await db.collection("comments").deleteMany({});
  await db.collection("time_table").deleteMany({});

  await db.collection("users").insertMany(users);
  const productResult = await db.collection("products").insertMany(products);

  const productIds = Object.values(productResult.insertedIds).map((id) =>
    id.toString()
  );

  const comments = [
    {
      productId: productIds[0] ?? "",
      author: "Ava Johnson",
      message: "Great value for the price.",
      createdAt: new Date("2026-01-22"),
    },
    {
      productId: productIds[1] ?? "",
      author: "Noah Smith",
      message: "The keys feel excellent for daily work.",
      createdAt: new Date("2026-01-23"),
    },
    {
      productId: productIds[2] ?? "",
      author: "Mia Rodriguez",
      message: "Display is crisp, but the stand is wobbly.",
      createdAt: new Date("2026-01-24"),
    },
  ];

  await db.collection("comments").insertMany(comments);
  await db.collection("time_table").insertMany(timeTables);
  await closeDb();
  console.log("Seeded users, products, comments, and time_table collections.");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
