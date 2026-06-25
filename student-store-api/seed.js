const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const path = require('path')

async function seed() {
  try {
    console.log('🌱 Seeding database...\n')

    // Clear existing data (in order due to foreign key constraints)
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()

    // Load products from JSON file
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8')
    )

    // Seed products and store them for reference
    const createdProducts = []
    for (const product of productsData.products) {
      const created = await prisma.product.create({
        data: {
          name: product.name,
          category: product.category,
          image: product.image_url,
          description: product.description,
          price: product.price
        }
      })
      createdProducts.push(created)
      console.log(`✅ Created product: ${product.name}`)
    }

    // Load orders from JSON file
    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/orders.json'), 'utf8')
    )

    // Map customer IDs to names/emails (since JSON only has IDs)
    const customerMap = {
      101: { name: "John Doe", email: "john@example.com" },
      102: { name: "Jane Smith", email: "jane@example.com" }
    }

    // Seed orders with their items from JSON
    for (const orderData of ordersData.orders) {
      const customer = customerMap[orderData.customer_id] || {
        name: `Customer ${orderData.customer_id}`,
        email: `customer${orderData.customer_id}@example.com`
      }

      // Build items data
      const itemsData = []
      for (const item of orderData.items) {
        // Find product by matching JSON product_id to created products index
        const product = createdProducts[item.product_id - 1]

        if (product) {
          itemsData.push({
            productId: product.id,
            quantity: item.quantity,
            price: item.price
          })
        }
      }

      // Create order with nested items
      const createdOrder = await prisma.order.create({
        data: {
          customerName: customer.name,
          customerEmail: customer.email,
          status: orderData.status,
          total: orderData.total_price,
          items: {
            create: itemsData
          }
        },
        include: {
          items: true
        }
      })

      console.log(`✅ Created order #${createdOrder.id} for: ${customer.name} with ${createdOrder.items.length} items`)
    }

    console.log(`\n🎉 Seeding complete! Added ${createdProducts.length} products and ${ordersData.orders.length} orders with their order items.`)
  } catch (err) {
    console.error('❌ Error seeding:', err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
