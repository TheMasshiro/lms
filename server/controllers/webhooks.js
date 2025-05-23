import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import paymongoPackage from "paymongo-node";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting Data from request body
    const { data, type } = req.body;

    // Switch Cases for differernt Events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          resume: "",
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const paymongoInstance = paymongoPackage(process.env.PAYMONGO_SECRET_KEY);

// PayMongo Webhooks Handler function
export const paymongoWebhooks = async (request, response) => {
  const signature = request.headers["paymongo-signature"];
  const rawBody = request.body.toString("utf8");

  try {
    const event = paymongoInstance.webhooks.constructEvent({
      payload: rawBody,
      signatureHeader: signature,
      webhookSecretKey: process.env.PAYMONGO_WEBHOOK_SECRET,
    });

    switch (event.type) {
      case "payment.paid": {
        const metadata = event.resource.attributes.metadata;
        const purchaseId = metadata.purchaseId;

        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(purchaseData.userId);

        purchaseData.status = "paid";
        await purchaseData.save();

        userData.isMember = true;
        await userData.save();

        break;
      }
      case "payment.failed": {
        const metadata = event.resource.attributes.metadata;
        const purchaseId = metadata.purchaseId;

        const purchaseData = await Purchase.findById(purchaseId);
        purchaseData.status = "failed";
        await purchaseData.save();
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.status(200).json({ received: true });
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }
};
