import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import crypto from 'crypto';


// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {

    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })

    // Getting Data from request body
    const { data, type } = req.body

    // Switch Cases for differernt Events
    switch (type) {
      case 'user.created': {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          resume: ''
        }
        await User.create(userData)
        res.json({})
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }
      default:
        break;
    }

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// PayMongo Webhooks to Manage Payments Action
export const paymongoWebhooks = async (req, res) => {
 console.log("Paymongo Webhook Triggered")
  try {
    const { type, data } = req.body;
    const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
    const signature = req.headers['paymongo-signature'];
  } catch (error) {
    console.error("Error in Paymongo Webhook:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(req.body), 'utf8');
  const digest = hmac.digest('hex');
  if (digest !== signature) {
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }
  console.log("Signature Verified")
  const { type, data } = req.body;
  console.log("Type:", type)
  console.log("Data:", data)
}