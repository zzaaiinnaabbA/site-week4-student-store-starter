const Product = require('../models/product');

// Controller function for GET /products
const getAllProducts = async (req, res) => {
    try {
        const { category, sort } = req.query;
        console.log('Query params - category:', category, 'sort:', sort);
        const products = await Product.listAllProducts(category, sort);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Controller function for GET /products/:id
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.fetchProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// Controller function for POST /products
const createProduct = async (req, res) => {
    try {
        const { name, category, image, description, price } = req.body;
        const requiredFields = ['name', 'category', 'image', 'description', 'price'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        const newProduct = await Product.createProduct(req.body);
        res.status(201).json({ product: newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// Controller function for PUT/PATCH /products/:id
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.fetchProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedProduct = await Product.updateProduct(id, req.body);
        res.status(200).json({ product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Controller function for DELETE /products/:id
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.fetchProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await Product.deleteProduct(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
