//jshint esversion: 6
import stripe from "stripe";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import medicineModel from "./models/medicines.js";
import userRoutes from "./routes/users.js";
import doctorRoutes from "./routes/doctors.js";
import medicineRoutes from "./routes/medicines.js";
import adminRoutes from "./routes/admin.js";
import deleteOldAppointments from "./deleteAppointment.js";
const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/user", userRoutes);
app.use("/doctor", doctorRoutes);
app.use("/medicines", medicineRoutes);
app.use("/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("<h1>Hurray! Server is Running</h1>");
});
app.get("/favicon.ico", function (req, res) {
  res.send("<h1>Hurray! Server is Running</h1>");
});

//stripe integration
const stripeInstance = stripe(process.env.Stripe_secret);
const YOUR_DOMAIN = "https://medhos.vercel.app";
app.post("/create-checkout-session", async (req, res) => {
  // console.log(req.body);
  const { product } = req.body;
  const ProductContainer=[];
  for(var i=0;i<product.length;i++){
    var medicine = await medicineModel.findById(product[i].medicineId);
    var qnty = product[i].qty;
    ProductContainer.push({medicine,qnty});
  }
  console.log(ProductContainer);
  const lineItems = ProductContainer.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.medicine.name,
      },
      unit_amount: product.medicine.price,
    },
    quantity: product.qnty,
  }));
  const session = await stripeInstance.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${YOUR_DOMAIN}/user/orders`,
    cancel_url: `${YOUR_DOMAIN}/cart`,
  });
  res.json({ id: session.id });
});

const PORT = process.env.PORT || 7000;
const DATABASE = process.env.CONNECTION_URL;
mongoose
  .connect(DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err.message);
    console.log("         Database URL       ");
  });

export default app;
