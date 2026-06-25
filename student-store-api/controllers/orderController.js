const Order = require('../models/order')

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.listAllOrders()
        res.status(200).json({ orders })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' })
    }
}

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.fetchOrderById(id)
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }

        res.status(200).json({ order })
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' })
    }
}

const createOrder = async (req, res) => {
    try {
        const { customerName, customerEmail, status, items } = req.body

        // Validate required fields
        if (!customerName || !customerEmail) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Validate items array exists and is not empty
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'items array is required' })
        }

        // Validate each item has productId and quantity
        for (const item of items) {
            if (!item.productId || !item.quantity) {
                return res.status(400).json({ error: 'Each item must have productId and quantity' })
            }
        }

        // Create order with transaction
        const newOrder = await Order.createOrder(req.body)
        res.status(201).json({ order: newOrder })
    } catch (error) {
        // Check if it's a product not found error
        if (error.message && error.message.includes('not found')) {
            return res.status(404).json({ error: error.message })
        }

        console.error('Error creating order:', error)
        res.status(500).json({ error: 'Failed to create order' })
    }
}

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.fetchOrderById(id)

        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        const updatedOrder = await Order.updateOrder(id, req.body)
        res.status(200).json({ order: updatedOrder })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' })
    }
}

const deleteOrder = async (req, res) => {   
    try {   
        const { id } = req.params
        const order = await Order.fetchOrderById(id)       
        if (!order) {
            return res.status(404).json({ error: 'Order not found' })
        }
        await Order.deleteOrder(id)
        res.status(200).json({ message: 'Order deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' })
    }
}

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
}