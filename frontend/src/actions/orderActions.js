import {
	 BOOKING_CREATE_REQUEST,
	 BOOKING_CREATE_SUCCESS,
	 BOOKING_CREATE_FAILURE,
	BOOKING_DETAILS_REQUEST,
	BOOKING_DETAILS_SUCCESS,
	BOOKING_DETAILS_FAILURE,
	BOOKING_PAY_REQUEST,
	BOOKING_PAY_SUCCESS,
	BOOKING_PAY_FAILURE,
	BOOKING_DELIVER_REQUEST,
	BOOKING_DELIVER_SUCCESS,
	BOOKING_DELIVER_FAILURE,
	BOOKING_USER_LIST_REQUEST,
	BOOKING_USER_LIST_SUCCESS,
	BOOKING_USER_LIST_FAILURE,
	BOOKING_ALL_LIST_REQUEST,
	BOOKING_ALL_LIST_SUCCESS,
	BOOKING_ALL_LIST_FAILURE,
} from '../constants/orderConstants';

import axios from 'axios';

// get all the details about the order and dispatch only of currently logged in
export const createOrder = (order) => async (dispatch, getState) => {
	try {
		dispatch({ type:  BOOKING_CREATE_REQUEST });

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

		const { data } = await axios.post('/api/orders/', order, config);

		dispatch({ type:  BOOKING_CREATE_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type:  BOOKING_CREATE_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// get details about a particular order
export const getOrderDetails = (orderID) => async (dispatch, getState) => {
	try {
		dispatch({ type: BOOKING_DETAILS_REQUEST });

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

		const { data } = await axios.get(`/api/orders/${orderID}`, config);

		dispatch({ type: BOOKING_DETAILS_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: BOOKING_DETAILS_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// update the current order to that of a paid one, and store the correct payment result
export const payOrder =
	(orderID, paymentResult) => async (dispatch, getState) => {
		try {
			dispatch({ type: BOOKING_PAY_REQUEST });

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
				`/api/orders/${orderID}/pay`,
				paymentResult,
				config
			);

			dispatch({ type: BOOKING_PAY_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: BOOKING_PAY_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

// Set the current order as delivered, only when logged in user is an admin
export const deliverOrder = (orderID) => async (dispatch, getState) => {
	try {
		dispatch({ type: BOOKING_DELIVER_REQUEST });

		const {
			userLogin: { userInfo },
		} = getState();

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

		const { data } = await axios.put(
			`/api/orders/${orderID}/deliver`,
			{},
			config
		);

		dispatch({ type: BOOKING_DELIVER_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: BOOKING_DELIVER_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// list all the orders of a particular user
export const listMyOrders = () => async (dispatch, getState) => {
	try {
		dispatch({ type: BOOKING_USER_LIST_REQUEST });

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

		const { data } = await axios.get(`/api/orders/myorders`, config);

		dispatch({ type: BOOKING_USER_LIST_SUCCESS, payload: data });
	} catch (error) {
		dispatch({
			type: BOOKING_USER_LIST_FAILURE,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

// list all orders for the admin panel view, include the pagenumber being fetched
export const listAllOrders =
	(pageNumber = '') =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: BOOKING_ALL_LIST_REQUEST });

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

			const { data } = await axios.get(
				`/api/orders?pageNumber=${pageNumber}`,
				config
			);

			dispatch({ type: BOOKING_ALL_LIST_SUCCESS, payload: data });
		} catch (error) {
			dispatch({
				type: BOOKING_ALL_LIST_FAILURE,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};
