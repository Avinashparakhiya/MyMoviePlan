import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc fetch all the products
// @route GET /api/products
// @access PUBLIC
const getAllProduts = asyncHandler(async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number being fetched
	const pageSize = Number(req.query.pageSize) || 10; // the total number of entries on a single page

	// match all products which include the string of chars in the keyword, not necessarily in the given order
	const keyword = req.query.keyword
		? {
				title: {
					$regex: req.query.keyword,
					$options: 'si',
				},
		  }
		: {};
	const count = await Product.countDocuments({ ...keyword }); // total number of products which match with the given key
	// find all products that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));

	// send the list of products, current page number, total number of pages available
	res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a single product by id
// @route GET /api/products/:id
// @access PUBLIC
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) res.json(product);
	else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access PRIVATE/ADMIN
const deleteMovie = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		await product.remove();
		res.json({ message: 'Product removed from DB' });
	} else {
		// throw a custom error so that our error middleware can catch them and return apt json
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc Create a product
// @route POST /api/products/
// @access PRIVATE/ADMIN
const createMovie = asyncHandler(async (req, res) => {
	// create a dummy product which can be edited later
	const product = new Product({
		title: 'Sample',
		cinema_name: 'Sample Brand',
		genres: 'Sample Category',
		imdbRating: 0,
		price: 0,
		user: req.user._id,
		posterurl: '/images/alexa.jpg',
		storyline: 'Sample description',
	});
	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

// @desc Update a product
// @route PUT /api/products/:id
// @access PRIVATE/ADMIN
const updateMovie = asyncHandler(async (req, res) => {
	const {
		title,
		price,
		cinema_name,
		genres,
		imdbRating,
		storyline,
		posterurl,
	} = req.body;
	const product = await Product.findById(req.params.id);

	// update the fields which are sent with the payload
	if (product) {
		if (title) product.title = title;
		if (price) product.price = price;
		if (cinema_name) product.cinema_name = cinema_name;
		if (genres) product.genres = genres;
		if (imdbRating) product.imdbRating = imdbRating;
		if (storyline) product.storyline = storyline;
		if (posterurl) product.image = posterurl;
		const updatedProduct = await product.save();
		if (updatedProduct) res.status(201).json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product not available');
	}
});


// @desc fetch top rated products
// @route GET /api/products/top
// @access PUBLIC
const getTopProduts = asyncHandler(async (req, res) => {
	// get top 4 rated products
	const topProduts = await Product.find({}).sort({ rating: -1 }).limit(4);
	res.json(topProduts);
});

export {
	getProductById,
	getAllProduts,
	deleteMovie,
	createMovie,
	updateMovie,
	getTopProduts,
};
