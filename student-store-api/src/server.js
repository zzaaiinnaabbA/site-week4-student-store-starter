require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Import routes
const productRoutes = require('../routes/productRoutes');
const orderRoutes = require('../routes/orderRoutes');

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Student API');
});

// Use product routes - all /products routes go to productRoutes
app.use('/products', productRoutes);

// Use order routes - all /orders routes go to orderRoutes
app.use('/orders', orderRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
