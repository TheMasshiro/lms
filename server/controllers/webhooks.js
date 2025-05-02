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

export const paymongoWebhooks = async (request, response) => {
  const signature = request.headers['paymongo-signature'];
  
  if (!signature) {
    console.error('Missing PayMongo signature');
    return response.status(400).send('Missing signature');
  }

  const rawBody = request.body.toString('utf8');
  
  try {
    const event = paymongo.webhooks.constructEvent({
      payload: rawBody,
      signatureHeader: signature,
      webhookSecretKey: process.env.PAYMONGO_WEBHOOK_SECRET,
    });
    
    console.log("PayMongo Webhook Event:", event.type);
    console.log("Event Data:", JSON.stringify(event.data, null, 2));


    switch (event.type) {
      case 'payment.paid': {
        const paymentData = event.data;

        const metadata = paymentData.attributes?.metadata || {};
        const purchaseId = metadata.purchaseId;
        
        console.log("Payment metadata:", metadata);
        console.log("Purchase ID from metadata:", purchaseId);
        
        if (!purchaseId) {
          console.error('No purchaseId found in payment metadata');
          return response.status(200).json({ received: true, status: 'missing-purchase-id' });
        }
        
        try {
          const purchaseData = await Purchase.findById(purchaseId);
          if (!purchaseData) {
            console.error(`Purchase with ID ${purchaseId} not found`);
            return response.status(200).json({ received: true, status: 'purchase-not-found' });
          }
          
          const userData = await User.findById(purchaseData.userId);
          if (!userData) {
            console.error(`User with ID ${purchaseData.userId} not found`);
            return response.status(200).json({ received: true, status: 'user-not-found' });
          }
          
          const courseData = await Course.findById(purchaseData.courseId.toString());
          if (!courseData) {
            console.error(`Course with ID ${purchaseData.courseId} not found`);
            return response.status(200).json({ received: true, status: 'course-not-found' });
          }

          if (!courseData.enrolledStudents.includes(userData._id)) {
            courseData.enrolledStudents.push(userData._id);
            await courseData.save();
          }

          if (!userData.enrolledCourses.includes(courseData._id)) {
            userData.enrolledCourses.push(courseData._id);
            await userData.save();
          }

          purchaseData.status = 'completed';
          purchaseData.paymentId = paymentData.id;
          await purchaseData.save();
          
          console.log(`Successfully processed payment for purchase ${purchaseId}`);
        } catch (error) {
          console.error('Error updating database after payment:', error);
          return response.status(200).json({ received: true, status: 'database-error', error: error.message });
        }
        break;
      }
      
      case 'payment.failed': {
        const paymentData = event.data;
        
        const metadata = paymentData.attributes?.metadata || {};
        const purchaseId = metadata.purchaseId;
        
        console.log("Payment metadata:", metadata);
        console.log("Purchase ID from metadata:", purchaseId);
        
        if (!purchaseId) {
          console.error('No purchaseId found in payment metadata');
          return response.status(200).json({ received: true, status: 'missing-purchase-id' });
        }
        
        try {
          const purchaseData = await Purchase.findById(purchaseId);
          if (!purchaseData) {
            console.error(`Purchase with ID ${purchaseId} not found`);
            return response.status(200).json({ received: true, status: 'purchase-not-found' });
          }
          
          purchaseData.status = 'failed';
          purchaseData.paymentId = paymentData.id;
          await purchaseData.save();
          
          console.log(`Marked purchase ${purchaseId} as failed`);
        } catch (error) {
          console.error('Error updating database after payment failure:', error);
          return response.status(200).json({ received: true, status: 'database-error', error: error.message });
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return response.status(200).json({ received: true, status: 'success' });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
}

// Enable PayMongo Webhook if not already enabled
export const enablePaymongoWebhook = async (request, response) => {
}