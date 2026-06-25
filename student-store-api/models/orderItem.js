const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class OrderItem {

  // Create a new order item
  static async createOrderItem(itemData) {
    const orderItem = await prisma.orderItem.create({
      data: itemData
    })
    return orderItem
  }

  // Get all items for a specific order
  static async fetchItemsByOrderId(orderId) {
    const items = await prisma.orderItem.findMany({
      where: { orderId: parseInt(orderId) }
    })
    return items
  }

  // Delete all items for a specific order (cascade usually handles this)
  static async deleteItemsByOrderId(orderId) {
    await prisma.orderItem.deleteMany({
      where: { orderId: parseInt(orderId) }
    })
  }

}

module.exports = OrderItem
