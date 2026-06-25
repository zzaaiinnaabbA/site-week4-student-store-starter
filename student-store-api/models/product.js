// Import the Prisma Client at the top
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class Product {

  // Method 1: Get all products
  static async listAllProducts(category, sort) {
    const options = {}

    if (category) {
      options.where = { category }
    }

    if (sort) {
      options.orderBy = { [sort]: 'asc' }
    }

    console.log('Prisma options:', JSON.stringify(options, null, 2))
    const products = await prisma.product.findMany(options)
    return products
  }

  // Method 2: Get one product by ID
  static async fetchProductById(productId) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })
    return product
  }

  // Method 3: Create a new product
  static async createProduct(productData) {
    const product = await prisma.product.create({
      data: productData
    })
    return product
  }

  // Method 4: Update a product
  static async updateProduct(productId, updates) {
    const product = await prisma.product.update({
      where: { id: parseInt(productId) },
      data: updates
    })
    return product
  }

  // Method 5: Delete a product
  static async deleteProduct(productId) {
    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(productId) }
    })
    return deletedProduct
  }

}

// Export the class so controllers can use it
module.exports = Product
