import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, paymongoWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'

// Initialize Express
const app = express()

// Connect to database
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors())
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => res.send("API Working"))
app.post('/clerk', express.json() , clerkWebhooks)

// Use raw body ONLY for the PayMongo webhook
app.use('/paymongo', (req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb',
      encoding: 'utf8',
    }, (err, string) => {
      if (err) return next(err);
      req.rawBody = string;
      try {
        req.body = JSON.parse(string); // optional, useful if you want both
      } catch (e) {
        return res.status(400).send('Invalid JSON');
      }
      next();
    });
  } else {
    next();
  }
});
app.post('/paymongo', express.raw({ type: 'application/json' }), paymongoWebhooks);

app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})