import {
	 BOOKING_CREATE_REQUEST,
	 BOOKING_CREATE_SUCCESS,
	 BOOKING_CREATE_FAILURE,
	ORDER_CREATE_RESET,
	BOOKING_DETAILS_REQUEST,
	BOOKING_DETAILS_SUCCESS,
	BOOKING_DETAILS_FAILURE,
	BOOKING_PAY_REQUEST,
	BOOKING_PAY_SUCCESS,
	BOOKING_PAY_FAILURE,
	ORDER_PAY_RESET,
	BOOKING_DELIVER_REQUEST,
	BOOKING_DELIVER_SUCCESS,
	BOOKING_DELIVER_FAILURE,
	ORDER_DELIVER_RESET,
	BOOKING_USER_LIST_REQUEST,
	BOOKING_USER_LIST_SUCCESS,
	BOOKING_USER_LIST_FAILURE,
	ORDER_USER_LIST_RESET,
	BOOKING_ALL_LIST_REQUEST,
	BOOKING_ALL_LIST_SUCCESS,
	BOOKING_ALL_LIST_FAILURE,
} from '../constants/orderConstants';

// create an order
export const orderCreateReducer = (state = {}, action) => {
	switch (action.type) {
		case  BOOKING_CREATE_REQUEST:
			return {
				loading: true,
			};
		case  BOOKING_CREATE_SUCCESS:
			return {
				loading: false,
				success: true,
				order: action.payload,
			};
		case  BOOKING_CREATE_FAILURE:
			return {
				loading: false,
				error: action.payload,
			};
		case ORDER_CREATE_RESET:
			return {};
		default:
			return { ...state };
	}
};

// get order details
export const orderDetailsReducer = (
	state = { loading: true, orderItems: [], billingAddress: {} },
	action
) => {
	switch (action.type) {
		case BOOKING_DETAILS_REQUEST:
			return {
				...state,
				loading: true,
			};
		case BOOKING_DETAILS_SUCCESS:
			return {
				loading: false,
				order: action.payload,
			};
		case BOOKING_DETAILS_FAILURE:
			return {
				loading: false,
				error: action.payload,
			};
		default:
			return { ...state };
	}
};

// update order payment options
export const orderPayReducer = (state = {}, action) => {
	switch (action.type) {
		case BOOKING_PAY_REQUEST:
			return {
				...state,
				loading: true,
			};
		case BOOKING_PAY_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case BOOKING_PAY_FAILURE:
			return {
				loading: false,
				error: action.payload,
			};
		case ORDER_PAY_RESET:
			return {};
		default:
			return { ...state };
	}
};

// update order to be delivered or not
export const orderConfirmedReducer = (state = {}, action) => {
	switch (action.type) {
		case BOOKING_DELIVER_REQUEST:
			return {
				...state,
				loading: true,
			};
		case BOOKING_DELIVER_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case BOOKING_DELIVER_FAILURE:
			return {
				loading: false,
				error: action.payload,
			};
		case ORDER_DELIVER_RESET:
			return {};
		default:
			return { ...state };
	}
};

// reducer to list orders of the particular user
export const orderListUserReducer = (state = { orders: [] }, action) => {
	switch (action.type) {
		case BOOKING_USER_LIST_REQUEST:
			return {
				...state,
				loading: true,
			};
		case BOOKING_USER_LIST_SUCCESS:
			return {
				loading: false,
				orders: action.payload,
			};
		case BOOKING_USER_LIST_FAILURE:
			return {
				loading: false,
				error: action.payload,
			};
		case ORDER_USER_LIST_RESET:
			return { orders: [] };
		default:
			return { ...state };
	}
};

// reducer to list all orders for the admin panel view
export const orderListAllReducer = (state = { orders: [] }, action) => {
	switch (action.type) {
		case BOOKING_ALL_LIST_REQUEST:
			return {
				...state,
				loading: true,
			};
		case BOOKING_ALL_LIST_SUCCESS:
			return {
				loading: false,
				orders: action.payload.orders,
				page: action.payload.page,
				pages: action.payload.pages,
				total: action.payload.total,
			};
		case BOOKING_ALL_LIST_FAILURE:
			return {
				loading: false,
				error: action.payload,
			};

		default:
			return { ...state };
	}
};
