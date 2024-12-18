const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const scholarRoutes = require('./routes/scholarRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

dotenv.config();
connectDB();



const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scholar', scholarRoutes);
app.use('/api', paymentRoutes);
app.get("/api/getkey", (req, res) => {
  res.status(200).json({
    keyId: "rzp_test_g6eiOXSsKay9YG",
  });
});

app.get("/", (req, res) => {
  res.send("hello world");  // Send "hello world" as a response to requests at "/"
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
