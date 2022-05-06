import express from 'express';
import {
	deleteMovie,
	getAllProduts,
	getProductById,
	createMovie,
	updateMovie,
	getTopProduts,
} from '../controllers/productControllers.js';
import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc fetch all the products, create a product
// @route GET /api/products
// @access PUBLIC
router
	.route('/')
	.get(getAllProduts)
	.post(protectRoute, isAdmin, createMovie);

// @desc fetch top rated products
// @route GET /api/products/top
// @access PUBLIC
router.route('/top').get(getTopProduts);

// @desc Fetch a single product by id, Delete a product,  update a product
// @route GET /api/products/:id
// @access PUBLIC & PRIVATE/ADMIN
router
	.route('/:id')
	.get(getProductById)
	.delete(protectRoute, isAdmin, deleteMovie)
	.put(protectRoute, isAdmin, updateMovie);

// @desc Create a product review
// @route POST /api/products/:id/reviews
// @access PRIVATE
router.route('/:id/reviews').post(protectRoute);

export default router;
