import {
	MOVIE_DETAILS_FAILURE,
	MOVIE_DETAILS_REQUEST,
	MOVIE_DETAILS_SUCCESS,
	MOVIE_LIST_FAILURE,
	MOVIE_LIST_REQUEST,
	MOVIE_LIST_SUCCESS,
	MOVIE_DELETE_FAILURE,
	MOVIE_DELETE_REQUEST,
	MOVIE_DELETE_SUCCESS,
	MOVIE_CREATE_REQUEST,
	MOVIE_CREATE_SUCCESS,
	MOVIE_CREATE_FAILURE,
	MOVIE_UPDATE_REQUEST,
	MOVIE_UPDATE_SUCCESS,
	MOVIE_UPDATE_FAILURE,
	PRODUCT_TOP_RATED_REQUEST,
	PRODUCT_TOP_RATED_SUCCESS,
	PRODUCT_TOP_RATED_FAILURE
} from '../constants/productConstants';
import axios from 'axios';

// list orders based on keyword and page number when paginated
export const listMovie =
	(keyword = '', pageNumber = '', pageSize = '') =>
	async (dispatch) => {
		try {
			dispatch({ type: MOVIE_LIST_REQUEST });

			const { data } = await axios.get(
				`/api/products?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=${pageSize}`
			);

			dispatch({ type: MOVIE_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: MOVIE_LIST_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// fetch details of a particular product
export const listMovieDetails = (id) => async (dispatch) => {
	try {
		dispatch({ type: MOVIE_DETAILS_REQUEST });

		const { data } = await axios.get(`/api/products/${id}`);

		dispatch({ type: MOVIE_DETAILS_SUCCESS, payload: data });
		console.log("productlist",data);
	} catch (error) {
		dispatch({
			type: MOVIE_DETAILS_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// delete a particular product by taking an id
export const deleteMovie = (id) => async (dispatch, getState) => {
	try {
		dispatch({ type: MOVIE_DELETE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.delete(`/api/products/${id}`, config);

		data && dispatch({ type: MOVIE_DELETE_SUCCESS });
	} catch (error) {
		dispatch({
			type: MOVIE_DELETE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// create a product, when the user is an admin
export const createMovie = () => async (dispatch, getState) => {
	try {
		dispatch({ type: MOVIE_CREATE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.post(`/api/products/`, {}, config);

		dispatch({ type: MOVIE_CREATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: MOVIE_CREATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// update the product details from the admin panel view
export const updateMovie = (product) => async (dispatch, getState) => {
	try {
		dispatch({ type: MOVIE_UPDATE_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

		// different headers are used when it is a social login, and when it is a std email login
		const config = userInfo.isSocialLogin
			? {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `SocialLogin ${userInfo.id}`,
					},
			  }
			: {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${userInfo.accessToken}`,
					},
			  };

		const { data } = await axios.put(
			`/api/products/${product._id}`,
			product,
			config
		);

		dispatch({ type: MOVIE_UPDATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: MOVIE_UPDATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const getTopRatedProducts = () => async (dispatch) => {
	try {
		dispatch({ type: PRODUCT_TOP_RATED_REQUEST });

		const { data } = await axios.get('/api/products/top');

		dispatch({ type: PRODUCT_TOP_RATED_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: PRODUCT_TOP_RATED_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

