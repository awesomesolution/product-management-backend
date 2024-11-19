import express from 'express';
import { listUsers, toggleUserStatus, listProducts, createProduct, getProductById, updateProduct, softDeleteProduct } from '../controllers/adminController';

const router = express.Router();

router.get('/users', listUsers);
router.put('/users/:userId', toggleUserStatus);
router.get('/products', listProducts);
router.post("/products/add", createProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:productId', softDeleteProduct);

export default router;