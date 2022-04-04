const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");


// configuration
const app = express();
dotenv.config();
app.use(express.json());


// mongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successfull"))
  .catch((error) => {
    console.log(error);
  });


  // Routes 
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/products", productRoute);
  app.use("/api/carts", cartRoute);
  app.use("/api/orders", orderRoute);

// Listening to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
