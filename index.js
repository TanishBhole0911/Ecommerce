// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: '*',
}));

// Get secret values from environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Define a schema and model for the product
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  mrpPrice:Number,
  description: String,
  images: [String],           // Array to hold multiple image URLs
  imageNo: Number,             // Number for referencing a specific image if needed
  flavours: [String],           // Corrected to [String] for Mongoose
  category: String,
  variants: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: String,           // Name of the variant, e.g., "1 kg", "30 servings"
      price: Number,          // Price specific to this variant
    },
  ],
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

// Define a schema and model for the user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  creationAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Define a schema and model for the cart
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Removed 'ref'
      quantity: { type: Number, required: true, default: 1 },
      title: {type: String},
      price:{type:Number},
      image:{type: String}

    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

// Define a schema and model for the order
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Removed 'ref'
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  creationAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

// Define a schema and model for emails
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  age: Number,
});

const Email = mongoose.model("Email", emailSchema);

// Middleware to check for login bearer token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    console.log("User:", user);
    req.user = user;
    next();
  });
};

// Route to add a new product
app.post("/addProduct", async (req, res) => {
  try {
    const productData = {
      title: req.body.title,
      price: req.body.price,
      mrpPrice: req.body.mrpPrice,
      description: req.body.description,
      images: req.body.images,
      flavours: req.body.flavours,
      creationAt: req.body.creationAt || new Date(),
      updatedAt: req.body.updatedAt || new Date(),
      category: req.body.category,
      variants: req.body.variants,
    };

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
});

app.post("/addProductsArray", async (req, res) => {
  try {
    const productsArray = req.body.products; // Expecting an array of products in the 'products' key of the request body

    if (!Array.isArray(productsArray)) {
      return res.status(400).json({
        message: "Invalid data format. Expected an array of products.",
      });
    }

    try {
      const newProducts = await Product.insertMany(productsArray);
      console.log("Products inserted successfully:", newProducts);
      res.status(200).json({ message: "Products added successfully", products: newProducts });
    } catch (error) {
      console.error("Error inserting products:", error);
      res.status(500).json({ message: "Error adding products", error });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding products", error });
  }
});

// Route for user signup
app.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received");
    const { username, password, email } = req.body;
    console.log("Signup request received");
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    console.log("Signup request received");
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
console.log("Signup request received");
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
console.log("Signup request received");
    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
console.log("Signup request received");
    await newUser.save();
    console.log("User created successfully");
    // console.log("User found:", user);
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    // console.log("Token generated:", token);
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({message: "User created successfully", userId: newUser._id ,token });
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
});

// Route for user login
app.post("/login", async (req, res) => {
  try {
    console.log("Login request received");
    const { email, password } = req.body;
    console.log("Email:", email);
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Route to add an item to the cart
app.post("/cart/add", authenticateToken, async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user.userId;
    // Validate variantId exists in product
    const product = await Product.findById(productId);
    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(400).json({ message: "Invalid variantId" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId && item.variantId.toString() === variantId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, variantId, quantity });
    }
    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart", error });
  }
});

// Route to remove an item from the cart
app.post("/cart/remove", authenticateToken, async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId || item.variantId.toString() !== variantId);

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing item from cart", error });
  }
});

// Route to reduce the number of products in the cart
app.post("/cart/reduce", authenticateToken, async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    console.log("Cart:", cart);
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId && item.variantId.toString() === variantId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity -= quantity;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
      await cart.save();
      console.log("Cart after reducing quantity:", cart);
      return res.status(200).json({ message: "Item quantity reduced", cart });
    } else {
      return res.status(400).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error reducing item quantity in cart", error });
  }
});

// Route to set the quantity of an item in the cart
app.post("/cart/setQuantity", authenticateToken, async (req, res) => {
  try {
    const { productId, variantId, quantity } = req.body;
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    }
    res.status(200).json({ message: "Item quantity set", cart });
  } catch (error) {
    console.error("Error setting item quantity in cart:", error);
    res.status(500).json({ message: "Error setting item quantity in cart", error });
  }
});

// Route to get all items in the cart
app.get("/cart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    } else {
      cart.items = await Promise.all(cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        const variant = product.variants.id(item.variantId);
        console.log("Product:", product.images[0]);
        return {
          productId: product._id,
          title: product.title,
          variantId: item.variantId,
          variantName: variant ? variant.name : null,
          price: variant.price,
          quantity: item.quantity,
          image: product.images[0],
        };
      }));
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// Route to get the number of items in the cart
app.get("/cart/itemsCount", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
      return res.status(200).json({ itemsCount: 0 });
    }

    const itemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    console.log("Items count:", itemsCount);
    res.status(200).json({ itemsCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items count", error });
  }
});

// Route to empty the cart completely into an order
app.post("/cart/checkout", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce((total, item) => total + item.productId.price * item.quantity, 0);

    const newOrder = new Order({
      userId,
      items: cart.items,
      totalAmount,
    });

    await newOrder.save();

    // Empty the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error checking out cart", error });
  }
});

// Route to get all products
app.get("/getProducts", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    console.log("Fetching products");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Route to get 20 products at a time
app.get("/getProductsBatch", async (req, res) => {
  try {
    const products = await Product.find().limit(20); // Fetch only 20 products
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Route to get details of a specific product by ID
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details", error });
  }
});

// Route to create an order
app.post("/order/create", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

// Route to get all orders of a user
app.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).populate("items.productId");

    if (!orders) {
      return res.status(400).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Route to get details of a specific order
app.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details", error });
  }
});

// Route to save email data
app.post("/saveEmail", async (req, res) => {
  try {
    const { email, name, age } = req.body;

    const newEmail = new Email({ email, name, age });
    await newEmail.save();

    res.status(201).json({ message: "Email data saved successfully", email: newEmail });
  } catch (error) {
    res.status(500).json({ message: "Error saving email data", error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
