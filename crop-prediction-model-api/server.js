import axios from 'axios'
import express, { response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import { swaggerSpec, swaggerUi } from './swagger.js'

const app = express()

// allow request from anywhere
app.use(
  cors({
    origin: '*',
    methods: ['POST'],
    allowedHeaders: ['content-Type'],
  })
)
// 🧠 Secure HTTP headers
app.use(helmet())

// 🧼 Prevent HTTP param pollution
app.use(hpp())

// 🚥 Rate limiting — protect from abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, try again in 15 minutes',
})
app.use(limiter)

app.use(express.json())

const port = process.env.PORT || 3000

app.get('/api/v1/predict', (req, res) => {
  res.send('WELCOME TO CROP PREDICTION API')
})

app.post('/api/v1/predict', async (req, res) => {
  const { temperature, humidity, pH, rainfall } = req.body

  // if (
  //   typeof temperature !== 'number' ||
  //   typeof humidity !== 'number' ||
  //   typeof pH !== 'number' ||
  //   typeof rainfall !== 'number'
  // ) {
  //   return res.status(400).json({message: "Only integers values are allowed"});
  // }

  console.log(typeof(temperature))

  const features = [temperature, humidity, pH, rainfall]
  console.log(features);
  try {
    const response = await axios.post(
      'http://localhost:5000/predict',
      {
        features,
      }
    )

    res.status(200).json({ message: response.data.prediction })
  } catch (error) {
    console.error('Prediction error:', error.message)
  }
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(port, () => console.log(`Server is running on port: ${port}`))
