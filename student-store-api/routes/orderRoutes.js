const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

// GET /orders - Get all orders
router.get('/', getAllOrders);

// GET /orders/:id - Get one order by ID
router.get('/:id', getOrderById);

// POST /orders - Create a new order
router.post('/', createOrder);

// PUT /orders/:id - Update an order (full update)
router.put('/:id', updateOrder);

// PATCH /orders/:id - Update an order (partial update)
router.patch('/:id', updateOrder);

// DELETE /orders/:id - Delete an order
router.delete('/:id', deleteOrder);

module.exports = router;
