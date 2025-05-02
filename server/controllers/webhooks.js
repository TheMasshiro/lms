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
  console.log('PayMongo webhook received');
  
  try {
    // Log headers for debugging
    console.log('Headers:', JSON.stringify(request.headers));
    
    // Get the signature from the headers
    const paymongoSignature = request.headers['paymongo-signature'];
    
    // If signature is not present, return error
    if (!paymongoSignature) {
      console.error('PayMongo signature is missing');
      return response.status(400).send('PayMongo signature is missing');
    }
    
    console.log('Signature present:', paymongoSignature);
    
    // For Express.raw(), the body is already a Buffer
    // For Express.json(), we need to use rawBody saved in the verify function
    let rawBody;
    
    if (Buffer.isBuffer(request.body)) {
      rawBody = request.body.toString('utf8');
    } else if (request.rawBody) {
      rawBody = request.rawBody;
    } else {
      rawBody = JSON.stringify(request.body);
    }
    
    console.log('Raw body obtained, length:', rawBody.length);
    
    // Parse the request body if it's a string
    const payload = typeof request.body === 'string' || Buffer.isBuffer(request.body) 
      ? JSON.parse(rawBody) 
      : request.body;
    
    // Log payload type for debugging
    console.log('Payload type:', typeof payload);
    
    // Verify the webhook signature
    try {
      const isValidSignature = verifyPaymongoSignature(
        rawBody,
        paymongoSignature,
        process.env.PAYMONGO_WEBHOOK_SECRET
      );
      
      console.log('Signature verification result:', isValidSignature);
      
      if (!isValidSignature) {
        console.error('Invalid PayMongo signature');
        return response.status(400).send('Invalid PayMongo signature');
      }
    } catch (verificationError) {
      console.error('Signature verification error:', verificationError);
      return response.status(400).send(`Signature verification error: ${verificationError.message}`);
    }
    
    // Handle different PayMongo event types
    console.log('Processing payload event data');
    
    // Check if we have the proper structure
    if (!payload || !payload.data || !payload.data.attributes || !payload.data.attributes.type) {
      console.error('Invalid webhook payload structure');
      console.log('Payload:', JSON.stringify(payload).substring(0, 200) + '...');
      // Return 200 anyway to prevent PayMongo from retrying the webhook
      return response.status(200).json({ received: true, status: 'invalid_payload_structure' });
    }
    
    const eventType = payload.data.attributes.type;
    console.log('Event type:', eventType);
    
    switch (eventType) {
      case 'payment.paid': {
        console.log('Processing payment.paid event');
        // Similar to payment_intent.succeeded in Stripe
        const paymentData = payload.data.attributes;
        const paymentId = payload.data.id;
        
        // Extract metadata - PayMongo has different structure
        // In PayMongo, metadata is typically attached to the payment or checkout session
        const metadata = paymentData.metadata || {};
        const purchaseId = metadata.purchaseId;
        
        console.log('Payment ID:', paymentId);
        console.log('Purchase ID from metadata:', purchaseId);
        
        if (purchaseId) {
          try {
            // Update your database
            const purchaseData = await Purchase.findById(purchaseId);
            if (!purchaseData) {
              console.error('Purchase not found:', purchaseId);
              return response.status(200).json({ received: true, status: 'purchase_not_found' });
            }
            
            const userData = await User.findById(purchaseData.userId);
            if (!userData) {
              console.error('User not found for purchase:', purchaseData.userId);
              return response.status(200).json({ received: true, status: 'user_not_found' });
            }
            
            const courseData = await Course.findById(purchaseData.courseId.toString());
            if (!courseData) {
              console.error('Course not found:', purchaseData.courseId);
              return response.status(200).json({ received: true, status: 'course_not_found' });
            }
            
            // Update course enrollment
            courseData.enrolledStudents.push(userData);
            await courseData.save();
            
            // Update user's enrolled courses
            userData.enrolledCourses.push(courseData._id);
            await userData.save();
            
            // Update purchase status
            purchaseData.status = 'completed';
            await purchaseData.save();
            
            console.log('Successfully processed payment.paid for purchase:', purchaseId);
          } catch (dbError) {
            console.error('Database error during payment.paid processing:', dbError);
            // Still return 200 to prevent retries, but log the error
            return response.status(200).json({ 
              received: true, 
              status: 'db_error',
              error: dbError.message 
            });
          }
        } else {
          console.warn('No purchaseId found in metadata for payment.paid event');
        }
        break;
      }
      case 'payment.failed': {
        console.log('Processing payment.failed event');
        // Similar to payment_intent.payment_failed in Stripe
        const paymentData = payload.data.attributes;
        const metadata = paymentData.metadata || {};
        const purchaseId = metadata.purchaseId;
        
        console.log('Purchase ID from metadata:', purchaseId);
        
        if (purchaseId) {
          try {
            const purchaseData = await Purchase.findById(purchaseId);
            if (!purchaseData) {
              console.error('Purchase not found:', purchaseId);
              return response.status(200).json({ received: true, status: 'purchase_not_found' });
            }
            
            purchaseData.status = 'failed';
            await purchaseData.save();
            console.log('Successfully updated purchase status to failed:', purchaseId);
          } catch (dbError) {
            console.error('Database error during payment.failed processing:', dbError);
            return response.status(200).json({ 
              received: true, 
              status: 'db_error',
              error: dbError.message 
            });
          }
        } else {
          console.warn('No purchaseId found in metadata for payment.failed event');
        }
        break;
      }
      case 'checkout_session.payment.paid': {
        console.log('Processing checkout_session.payment.paid event');
        // Handle checkout session payment success
        // This is specific to PayMongo's checkout sessions
        const checkoutSession = payload.data.attributes;
        const metadata = checkoutSession.metadata || {};
        const purchaseId = metadata.purchaseId;
        
        console.log('Purchase ID from metadata:', purchaseId);
        
        if (purchaseId) {
          try {
            // Similar logic as payment.paid
            const purchaseData = await Purchase.findById(purchaseId);
            if (!purchaseData) {
              console.error('Purchase not found:', purchaseId);
              return response.status(200).json({ received: true, status: 'purchase_not_found' });
            }
            
            const userData = await User.findById(purchaseData.userId);
            if (!userData) {
              console.error('User not found for purchase:', purchaseData.userId);
              return response.status(200).json({ received: true, status: 'user_not_found' });
            }
            
            const courseData = await Course.findById(purchaseData.courseId.toString());
            if (!courseData) {
              console.error('Course not found:', purchaseData.courseId);
              return response.status(200).json({ received: true, status: 'course_not_found' });
            }
            
            courseData.enrolledStudents.push(userData);
            await courseData.save();
            
            userData.enrolledCourses.push(courseData._id);
            await userData.save();
            
            purchaseData.status = 'completed';
            await purchaseData.save();
            console.log('Successfully processed checkout session payment for purchase:', purchaseId);
          } catch (dbError) {
            console.error('Database error during checkout_session.payment.paid processing:', dbError);
            return response.status(200).json({ 
              received: true, 
              status: 'db_error',
              error: dbError.message 
            });
          }
        } else {
          console.warn('No purchaseId found in metadata for checkout_session.payment.paid event');
        }
        break;
      }
      case 'source.chargeable': {
        console.log('Processing source.chargeable event');
        // Handle when a source becomes chargeable
        // This is used for payment methods that require additional steps
        // You may need to create a payment using this source
        const sourceData = payload.data;
        console.log('Source ID:', sourceData.id);
        console.log('Source is chargeable');
        break;
      }
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
    
    // Return a success response
    console.log('Webhook processed successfully');
    return response.status(200).json({ received: true });
  } catch (error) {
    console.error('PayMongo Webhook Error:', error);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }
}

/**
 * Verifies PayMongo webhook signature
 * @param {string} payload - The raw request body as a string
 * @param {string} signature - The PayMongo signature from the headers
 * @param {string} secret - The webhook secret from PayMongo dashboard
 * @returns {boolean} - Whether the signature is valid
 */
function verifyPaymongoSignature(payload, signature, secret) {
  console.log('Verifying signature...');
  
  // Log the first part of the signature and payload for debugging (don't log full values in production)
  console.log('Signature prefix:', signature.substring(0, 15) + '...');
  console.log('Payload length:', payload.length);
  
  try {
    // PayMongo sends the timestamp and signatures in format: t=timestamp,v1=signature
    const signatureParts = signature.split(',');
    
    if (signatureParts.length < 2) {
      console.error('Invalid signature format, expected t=timestamp,v1=signature');
      return false;
    }
    
    // Extract timestamp and actual signature
    const timestampPart = signatureParts[0].split('=');
    const signaturePart = signatureParts[1].split('=');
    
    if (timestampPart.length !== 2 || signaturePart.length !== 2) {
      console.error('Invalid signature format, could not extract timestamp or signature value');
      return false;
    }
    
    const timestamp = timestampPart[1];
    const signatureValue = signaturePart[1];
    
    console.log('Extracted timestamp:', timestamp);
    console.log('Extracted signature value prefix:', signatureValue.substring(0, 10) + '...');
    
    // Generate the signed payload (timestamp + '.' + payload)
    const signedPayload = `${timestamp}.${payload}`;
    
    // Generate the expected signature
    const hmac = crypto.createHmac('sha256', secret);
    const expectedSignature = hmac.update(signedPayload).digest('hex');
    
    console.log('Expected signature prefix:', expectedSignature.substring(0, 10) + '...');
    
    // For short signatures, direct comparison is safer
    if (signatureValue === expectedSignature) {
      return true;
    }
    
    // For longer signatures, use timingSafeEqual
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signatureValue),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('Error in timingSafeEqual comparison:', error);
      // Fall back to direct comparison if timingSafeEqual fails
      return signatureValue === expectedSignature;
    }
  } catch (error) {
    console.error('Signature verification exception:', error);
    return false;
  }
}