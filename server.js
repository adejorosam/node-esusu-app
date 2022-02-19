const path = require('path');
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const morgan = require('morgan')
const colors = require('colour')
const db = require('./src/config/db')
const errorHandlerMiddleware = require('./src/middleware/errorHandlerMiddleware')


// Load env vars
dotenv.config({ path: './config/config.env' });


// Test DB
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))


// Route files
const authRoutes = require("./src/routes/user")
const groupRoutes = require("./src/routes/group")

const app = express();

// Body parser
app.use(express.json());



// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}



// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/home', (req, res)  => {
  return res.json("Welcome")
})


app.use(errorHandlerMiddleware);

app.use('/home', (req, res, next)  => {
  return res.json("Welcome to Esusu Service API")
})
app.use("/api/v1/auth/", authRoutes);
app.use('/api/v1/', groupRoutes);


app.use(errorHandlerMiddleware);


const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});