import user from "../models/userModel.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with clerk webhook secret
    const wHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // getting headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // verifying headers
    await wHook.verify(JSON.stringify(req.body), headers);

    // Getting data request body
    const { data, type } = req.body;

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    // Switch cases for different events
    switch (type) {
      case user.created: {
        await user.create(userData);
        break;
      }
      case user.updated: {
        await user.findByIdAndUpdate(data.id, userData);
        break;
      }
      case user.deleted: {
        await user.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.json({ success: true, msg: "Webhook Received" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: error.message });
  }
};

export default clerkWebhooks;
