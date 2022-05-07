import {
	MOVIE_LIST_REQUEST,
	MOVIE_LIST_SUCCESS,
	MOVIE_LIST_FAILURE,
	MOVIE_DETAILS_FAILURE,
	MOVIE_DETAILS_REQUEST,
	MOVIE_DETAILS_SUCCESS,
	MOVIE_DELETE_FAILURE,
	MOVIE_DELETE_REQUEST,
	MOVIE_DELETE_SUCCESS,
	MOVIE_CREATE_SUCCESS,
	MOVIE_CREATE_FAILURE,
	MOVIE_CREATE_REQUEST,
	MOVIE_CREATE_RESET,
	MOVIE_UPDATE_SUCCESS,
	MOVIE_UPDATE_FAILURE,
	MOVIE_UPDATE_REQUEST,
	MOVIE_UPDATE_RESET,
	PRODUCT_TOP_RATED_SUCCESS,
	PRODUCT_TOP_RATED_FAILURE,
	PRODUCT_TOP_RATED_REQUEST
} from '../constants/productConstants';

// list products based on keyword and paginated page number
export const movieListReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case MOVIE_LIST_REQUEST:
			return { loading: true, products: [] };

		case MOVIE_LIST_SUCCESS:
			return {
				loading: false,
				products: action.payload.products,
				page: action.payload.page,
				pages: action.payload.pages,
			};

		case MOVIE_LIST_FAILURE:
			return { loading: false, error: action.payload };

		default:
			return { state };
	}
};

// details about a particular product
export const movieDetailsReducer = (
	state = { product: { reviews: [] } },
	action
) => {
	switch (action.type) {
		case MOVIE_DETAILS_REQUEST:
			return { loading: true, ...state };
		case MOVIE_DETAILS_SUCCESS:
			return { loading: false, product: action.payload };
		case MOVIE_DETAILS_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

export const movieDeleteReducer = (state = {}, action) => {
	switch (action.type) {
		case MOVIE_DELETE_REQUEST:
			return { loading: true };
		case MOVIE_DELETE_SUCCESS:
			return { loading: false, success: true };
		case MOVIE_DELETE_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

export const movieCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case MOVIE_CREATE_REQUEST:
			return { loading: true };
		case MOVIE_CREATE_SUCCESS:
			return { loading: false, success: true, product: action.payload };
		case MOVIE_CREATE_FAILURE:
			return { loading: false, error: action.payload };
		case MOVIE_CREATE_RESET:
			return {};
		default:
			return { ...state };
	}
};

export const movieUpdateReducer = (state = { product: {} }, action) => {
	switch (action.type) {
		case MOVIE_UPDATE_REQUEST:
			return { loading: true };
		case MOVIE_UPDATE_SUCCESS:
			return { loading: false, success: true, product: action.payload };
		case MOVIE_UPDATE_FAILURE:
			return { loading: false, error: action.payload };
		case MOVIE_UPDATE_RESET:
			return { product: {} };
		default:
			return { ...state };
	}
};

export const productTopRatedReducer = (state = { products: [] }, action) => {
	switch (action.type) {
		case PRODUCT_TOP_RATED_REQUEST:
			return { loading: true, products: [] };
		case PRODUCT_TOP_RATED_SUCCESS:
			return { loading: false, products: action.payload };
		case PRODUCT_TOP_RATED_FAILURE:
			return { loading: false, error: action.payload };
		default:
			return { ...state };
	}
};

