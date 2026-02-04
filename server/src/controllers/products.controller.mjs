import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateProductPayload } from "../models/product.model.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function listProducts(req, res, next) {
  try {
    const db = await getDb();
    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const productId = toObjectId(req.params.id);
    if (!productId) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const db = await getDb();
    const product = await db.collection("products").findOne({ _id: productId });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { valid, errors, value } = validateProductPayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const product = { ...value, createdAt: new Date() };
    const db = await getDb();
    const result = await db.collection("products").insertOne(product);
    res.status(201).json({ _id: result.insertedId, ...product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const productId = toObjectId(req.params.id);
    if (!productId) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const { valid, errors, value } = validateProductPayload(req.body, {
      partial: true,
    });

    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    if (!Object.keys(value).length) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const db = await getDb();
    const result = await db.collection("products").findOneAndUpdate(
      { _id: productId },
      { $set: value },
      { returnDocument: "after" }
    );

    if (!result.value) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const productId = toObjectId(req.params.id);
    if (!productId) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const db = await getDb();
    const result = await db.collection("products").findOneAndDelete({
      _id: productId,
    });

    if (!result.value) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
