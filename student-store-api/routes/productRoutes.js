const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// GET /products - Get all products
router.get('/', getAllProducts);

// GET /products/:id - Get one product by ID
router.get('/:id', getProductById);

// POST /products - Create a new product
router.post('/', createProduct);

// PUT /products/:id - Update a product (full update)
router.put('/:id', updateProduct);

// PATCH /products/:id - Update a product (partial update)
router.patch('/:id', updateProduct);

// DELETE /products/:id - Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;
