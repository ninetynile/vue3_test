const Product = require('../model/Product');

const addProduct = async (req, res) => {
  const { name, category, quantity, price } = req.body;

  try {
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this name already exists' });
    }

    const product = new Product({ name, category, quantity, price });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProductQuantity = async (req, res) => {
  const { name, quantity } = req.body;
  try {
    const product = await Product.findOne({ name });
    if (product) {
      product.quantity = quantity;
      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const increaseProductQuantity = async (req, res) => {
  const { name, quantityToAdd } = req.body;
  try {
    const product = await Product.findOne({ name });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.quantity += parseInt(quantityToAdd, 10);

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const decreaseProductQuantity = async (req, res) => {
  const { name, quantityToSubtract } = req.body;
  try {
    const product = await Product.findOne({ name });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity - quantityToSubtract < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    product.quantity -= parseInt(quantityToSubtract, 10);

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addProduct = addProduct;
exports.getAllProducts = getAllProducts;
exports.updateProductQuantity = updateProductQuantity;
exports.deleteProduct = deleteProduct;
exports.increaseProductQuantity = increaseProductQuantity;
exports.decreaseProductQuantity = decreaseProductQuantity;
