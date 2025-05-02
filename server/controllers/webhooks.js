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
  try {
    console.log("Paymongo Webhook Triggered");

    // Step 1: Get raw body string
    const raw = req.rawBody?.toString('utf8');

    // Step 2: Parse it to JSON
    const body = JSON.parse(raw);
    console.log("Parsed body:", JSON.stringify(body, null, 2));

    // Step 3: Verify signature
    const signatureHeader = req.headers['paymongo-signature'];
    const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
    if (!signatureHeader || !secret || !raw) {
      console.error("Missing signature, secret or raw body");
      return res.status(400).send("Missing headers or body");
    }

    const [timestampPart, hashPart] = signatureHeader.split(',').map(s => s.split('=')[1]);
    const signedPayload = `${timestampPart}.${raw}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    if (expectedSignature !== hashPart) {
      console.error("Signature mismatch");
      return res.status(400).send("Invalid signature");
    }

    // Step 4: Handle event
    const eventType = body.data.attributes.type;
    const eventData = body.data.attributes.data;

    if (eventType === 'checkout_session.payment.paid') {
      const purchaseId = eventData.attributes.metadata?.purchaseId;
      if (!purchaseId) {
        console.error("Missing purchaseId");
        return res.status(400).send("No purchaseId");
      }

      // Update purchase logic here
      // ...

      return res.status(200).send("Success");
    }

    res.status(200).send("Unhandled event");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Internal error");
  }
};