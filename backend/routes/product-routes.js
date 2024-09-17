const express = require('express');
const { 
    addProduct, 
    getAllProducts, 
    updateProductQuantity, 
    deleteProduct,
    increaseProductQuantity,
    decreaseProductQuantity
} = require('../controller/product-controller');
const router = express.Router();

router.post('/add', addProduct);
router.get('/product', getAllProducts);
router.put('/update', updateProductQuantity);
router.delete('/delete/:id', deleteProduct);
router.put('/increase', increaseProductQuantity);
router.put('/decrease', decreaseProductQuantity);

module.exports = router;
