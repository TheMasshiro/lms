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

function verifyPaymongoSignature(payload, signature, secret) {
  const signatureParts = signature.split(',');
  
  if (signatureParts.length < 2) {
    return false;
  }
  
  const timestamp = signatureParts[0].split('=')[1];
  const signatureValue = signatureParts[1].split('=')[1];
  
  const signedPayload = `${timestamp}.${payload}`;
  
  // Generate the expected signature
  const hmac = crypto.createHmac('sha256', secret);
  const expectedSignature = hmac.update(signedPayload).digest('hex');
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureValue),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Error comparing signatures:', error);
    return false;
  }
}

// PayMongo Webhooks to Manage Payments Action
export const paymongoWebhooks = async (request, response) => {
  const paymongoSignature = request.headers['paymongo-signature'];
  
  if (!paymongoSignature) {
    return response.status(400).send('PayMongo signature is missing');
  }

  try {
    const payload = request.body;
    const rawBody = request.rawBody || JSON.stringify(payload);
    
    const isValidSignature = verifyPaymongoSignature(
      rawBody,
      paymongoSignature,
      process.env.PAYMONGO_WEBHOOK_SECRET
    );
    
    if (!isValidSignature) {
      return response.status(400).send('Invalid PayMongo signature');
    }
    
    const eventType = payload.data.attributes.type;
    
    switch (eventType) {
      case 'payment.paid': {
        const paymentData = payload.data.attributes;
        const paymentId = payload.data.id;
        
        const metadata = paymentData.metadata || {};
        const purchaseId = metadata.purchaseId;
        
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
      case 'payment.failed': {
        const paymentData = payload.data.attributes;
        const metadata = paymentData.metadata || {};
        const purchaseId = metadata.purchaseId;
        
        if (purchaseId) {
          const purchaseData = await Purchase.findById(purchaseId);
          purchaseData.status = 'failed';
          await purchaseData.save();
        }
        break;
      }
      case 'checkout_session.payment.paid': {
        const checkoutSession = payload.data.attributes;
        const metadata = checkoutSession.metadata || {};
        const purchaseId = metadata.purchaseId;
        
        if (purchaseId) {
          // Similar logic as payment.paid
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
      case 'source.chargeable': {
        console.log('Source is chargeable:', payload.data);
        break;
      }
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    // Return a success response
    return response.status(200).json({ received: true });
  } catch (error) {
    console.error('PayMongo Webhook Error:', error);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }
}