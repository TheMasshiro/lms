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
  const signatureHeader = req.headers['paymongo-signature'];
  const rawBody = JSON.stringify(req.body);

  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  const [timestamp, signature] = signatureHeader.split(',');

  const signedPayload = `${timestamp}.${rawBody}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(signedPayload);
  const expectedSignature = hmac.digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).send('Webhook signature verification failed');
  }

  const event = req.body;

  switch (event.type) {
    case 'payment.paid': {
      const desc = paymentData.description;
      const match = desc.match(/purchase:([a-f\d]{24})/);
      const purchaseId = match ? match[1] : null;

      const purchase = await Purchase.findById(purchaseId);
      const user = await User.findById(purchase.userId);
      const course = await Course.findById(purchase.courseId.toString());

      course.enrolledStudents.push(user);
      await course.save();

      user.enrolledCourses.push(course._id);
      await user.save();

      purchase.status = 'completed';
      await purchase.save();

      break;
    }

    case 'payment.failed': {
      const paymentData = event.data.attributes;
      const purchaseId = paymentData.description;

      const purchase = await Purchase.findById(purchaseId);
      purchase.status = 'failed';
      await purchase.save();

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}