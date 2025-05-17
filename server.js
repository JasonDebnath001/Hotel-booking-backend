import e from "express";
import "dotenv/config";
import cors from "cors";
import connectDb from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDb();

const app = e();
app.use(cors()); // enable cross origin resource sharing

// middlewares
app.use(e.json());
app.use(clerkMiddleware());

// API to listen clerk webhook
app.use("/api/clerk", clerkWebhooks);

app.get("/", (req, res) => {
  return res.send("API is working");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
