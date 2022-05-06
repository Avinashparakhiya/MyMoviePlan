import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		title: {
			type: String,
			required: true,
		},
		posterurl: {
			type: String,
			required: true,
		},
		cinema_name: {
			type: String,
			required: true,
		},
		genres: [],
		storyline: {
			type: String,
		},
		// store an array of review objs
		actors: [],
		imdbRating: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
		},
		posterurl: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Product = mongoose.model('Product', productSchema);

export default Product;
