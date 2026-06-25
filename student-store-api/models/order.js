const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Order {

    static async listAllOrders() {
        const orders = await prisma.order.findMany({
            include: { items: true } // Include related order items
        })
        return orders
    }

    static async fetchOrderById(orderId) {
        const order = await prisma.order.findUnique({
            where: {id: parseInt(orderId)},
            include: { items: true } // Include related order items
        })
        return order
    }

    static async createOrder(orderData) {
        // This method now handles the full transactional order creation
        // orderData should have: customerName, customerEmail, status (optional), items array

        const { customerName, customerEmail, status = "pending", items } = orderData

        // Use a transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            // Step 1: Fetch all products to get their current prices
            const productIds = items.map(item => item.productId)
            const products = await tx.product.findMany({
                where: {
                    id: { in: productIds }
                }
            })

            // Step 2: Verify all products exist
            if (products.length !== productIds.length) {
                const foundIds = products.map(p => p.id)
                const missingId = productIds.find(id => !foundIds.includes(id))
                throw new Error(`Product with id ${missingId} not found`)
            }

            // Step 3: Build a product lookup map
            const productMap = {}
            products.forEach(product => {
                productMap[product.id] = product
            })

            // Step 4: Calculate total and prepare order items data
            let total = 0
            const orderItemsData = items.map(item => {
                const product = productMap[item.productId]
                const itemTotal = product.price * item.quantity
                total += itemTotal

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price // Snapshot price at time of order
                }
            })

            // Step 5: Create the order with nested order items
            const order = await tx.order.create({
                data: {
                    customerName,
                    customerEmail,
                    status,
                    total,
                    items: {
                        create: orderItemsData
                    }
                },
                include: {
                    items: true // Include the created items in the response
                }
            })

            return order
        })

        return result
    }
    
    static async updateOrder(orderId, updates) {
        const order = await prisma.order.update({
            where: {id: parseInt(orderId)},
            data: updates           
        })
        return order
    }

    static async deleteOrder(orderId) {
        const deletedOrder = await prisma.order.delete({
            where: {id: parseInt(orderId)}
        })
        return deletedOrder
    }
}

module.exports = Order

