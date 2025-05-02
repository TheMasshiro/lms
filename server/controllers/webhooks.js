import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import paymongoPackage from 'paymongo-node';


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


const paymongo = paymongoPackage(process.env.PAYMONGO_SECRET_KEY);

// PayMongo Webhooks Handler function
export const paymongoWebhooks = async (request, response) => {
  const signature = request.headers['paymongo-signature'];
  
  if (!signature) {
    console.error('Missing PayMongo signature');
    return response.status(400).send('Missing signature');
  }

  const rawBody = request.body.toString('utf8');
  
  console.log("Paymongo Webhook Signature:", signature);
  console.log("Paymongo Webhook Headers:", request.headers);
  
  try {
    const event = paymongo.webhooks.constructEvent({
      payload: rawBody,
      signatureHeader: signature,
      webhookSecretKey: process.env.PAYMONGO_WEBHOOK_SECRET,
    });
    
    console.log("Webhook Event Received:", event.type);
    
    response.status(200).json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
}

// Enable PayMongo Webhook if not already enabled
export const enablePaymongoWebhook = async (request, response) => {
}