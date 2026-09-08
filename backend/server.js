const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const products = [
  { id: 1, name: "UltraTech PPC Cement", brand: "UltraTech", category: "Cement", weight: "50 kg Bag", price: 390 },
  { id: 2, name: "ACC Gold Water Shield", brand: "ACC", category: "Cement", weight: "50 kg Bag", price: 420 },
  { id: 3, name: "Ambuja Plus Cement", brand: "Ambuja", category: "Cement", weight: "50 kg Bag", price: 405 },
  { id: 4, name: "JK Super Cement", brand: "JK Cement", category: "Cement", weight: "50 kg Bag", price: 395 },
  { id: 5, name: "TMT Steel Bar Fe 500", brand: "Tata Tiscon", category: "Steel", weight: "12 mm", price: 690 },
  { id: 6, name: "TMT Steel Bar Fe 550", brand: "JSW Steel", category: "Steel", weight: "16 mm", price: 980 },
  { id: 7, name: "Premium Red Clay Bricks", brand: "Cement Mall", category: "Bricks", weight: "Standard Size", price: 9 },
  { id: 8, name: "AAC Concrete Blocks", brand: "BuildBlock", category: "Bricks", weight: "600 × 200 × 100 mm", price: 65 },
  { id: 9, name: "Premium River Sand", brand: "Cement Mall", category: "Sand", weight: "1 Ton", price: 3200 },
  { id: 10, name: "M-Sand", brand: "Cement Mall", category: "Sand", weight: "1 Ton", price: 2800 }
];

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    items: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cement Mall Backend is running"
  });
});

app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    count: products.length,
    products: products
  });
});

app.get("/api/orders", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected"
      });
    }

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    console.error("Fetch orders error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    console.log("Order request received:");
    console.log(req.body);

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "MongoDB is not connected"
      });
    }

    const customer = req.body.customer;
    const items = req.body.items;
    const total = req.body.total;

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer details are required"
      });
    }

    if (!items) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    if (total === undefined || total === null) {
      return res.status(400).json({
        success: false,
        message: "Order total is required"
      });
    }

    const newOrder = new Order({
      customer: customer,
      items: items,
      total: Number(total)
    });

    const savedOrder = await newOrder.save();

    console.log("Order saved successfully:", savedOrder._id.toString());

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is missing in .env file");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("=================================");
    console.log("       CEMENT MALL BACKEND");
    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log("Server running on http://localhost:" + PORT);
    console.log("Products API: http://localhost:" + PORT + "/api/products");
    console.log("Orders API: http://localhost:" + PORT + "/api/orders");
    console.log("=================================");

    app.listen(PORT);
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  }
}

startServer();