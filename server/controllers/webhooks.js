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
export const paymongoWebhooks = async (request, response) => {
  const signature = request.headers['x-paymongo-signature'];
  const payload = request.body;
  let event;
  
  try {
    // Verify webhook signature
    const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    
    if (digest !== signature) {
      throw new Error('Invalid signature');
    }
    
    event = payload;
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  
  // Handle the event
  switch (event.data.attributes.type) {
    case 'payment.paid': {
      const payment = event.data.attributes;
      const paymentId = event.data.id;
      
      const purchaseId = payment.metadata?.purchaseId;
      
      if (purchaseId) {
        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());
        
        courseData.enrolledStudents.push(userData);
        await courseData.save();
        
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
        
        purchaseData.status = 'completed';
        await purchaseData.save();
      }
      break;
    }
    case 'payment.failed':
    case 'source.chargeable.expired':
    case 'payment.failed': {
      const payment = event.data.attributes;
      const purchaseId = payment.metadata?.purchaseId;
      
      if (purchaseId) {
        const purchaseData = await Purchase.findById(purchaseId);
        purchaseData.status = 'failed';
        await purchaseData.save();
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.data.attributes.type}`);
  }
  
  response.json({ received: true });
};