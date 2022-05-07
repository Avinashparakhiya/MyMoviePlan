import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
} from '../actions/orderActions';
import {
	ORDER_PAY_RESET,
	ORDER_DELIVER_RESET,
} from '../constants/orderConstants';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { refreshLogin } from '../actions/userActions';
import CheckoutForm from '../components/CheckoutForm'; //stripe checkout form
import getDateString from '../utils/getDateString';

const OrderPage = ({ match, history }) => {
	// load stripe
	const stripePromise = loadStripe(
		"pk_test_51KT1ViSHBhnS0iz5gcK9EOmw7JBb4XrX5CqFBFKzrb8QKAK7vduvvREaorJjFHOmVoJNSYyoAX6Uu1LVF24reCm5005ZhpwrBW"
	);
	const dispatch = useDispatch();
	const orderID = match.params.id;

	const orderDetails = useSelector((state) => state.orderDetails);
	const { loading, order, error } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	const orderConfirmed = useSelector((state) => state.orderConfirmed);
	const { loading: loadingDeliver, success: successDeliver } = orderConfirmed;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	// get new access tokens using the refresh token, is user details throws an error
	useEffect(() => {
		if (userLoginError && userInfo) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	// set order to paid or delivered, and fetch updated orders
	useEffect(() => {
		if (!order || order._id !== orderID || successPay || successDeliver) {
			if (successPay) dispatch({ type: ORDER_PAY_RESET });
			if (successDeliver) dispatch({ type: ORDER_DELIVER_RESET });
			dispatch(getOrderDetails(orderID));
		}
	}, [order, orderID, dispatch, successPay, successDeliver]);

	// set order as delivered
	const successDeliveryHandler = () => {
		dispatch(deliverOrder(orderID));
	};

	return loading ? (
		<Loader />
	) : error ? (
		<Message dismissible variant='danger' duration={10}>
			{error}
		</Message>
	) : (
		<>
			<h2>Order {orderID}</h2>
			<Row>
				{loading ? (
					<Loader />
				) : (
					<>
						<Col md={8}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>Payment Method</h2>
									<p>
										<strong>Method: </strong>{' '}
										{order.paymentMethod}
									</p>
									<div>
										{order.isDelivered ? (
											<Message variant='success'>
											 Ticket Is Confirmed
											</Message>
										) : (
											<Message variant='danger'>
												Not Confirm Your Ticket waiting.....</Message>
										)}
									</div>
									<div>
										{order.isPaid ? (
											<Message variant='success'>
												Payment Successfully Done:{' '}
												{getDateString(order.paidAt)}
											</Message>
										) : (
											<Message variant='danger'>
												Payment Null !!!!!
											</Message>
										)}
									</div>
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Cart Items</h2>
									{order.orderItems.length !== 0 ? (
										<ListGroup variant='flush'>
											<div
												style={{
													background: 'red',
												}}></div>
											{order.orderItems.map(
												(item, idx) => (
													<ListGroup.Item key={idx}>
														<Row>
															<Col md={2}>
																<Image
																	className='product-image'
																	src={
																		item.posterurl
																	}
																	alt={
																		item.title
																	}
																	fluid
																	rounded
																/>
															</Col>
															<Col>
																<Link
																	to={`/product/${item.product}`}>
																	{item.title}
																</Link>
															</Col>
															<Col md={4}>
																{item.qty} x{' '}
																{item.price} ={' '}
																{(
																	item.qty *
																	item.price
																).toLocaleString(
																	'en-IN',
																	{
																		maximumFractionDigits: 2,
																		style: 'currency',
																		currency:
																			'INR',
																	}
																)}
															</Col>
														</Row>
													</ListGroup.Item>
												)
											)}
										</ListGroup>
									) : (
										<Message>No order</Message>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={4}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<h2 className='text-center'>
											Order Summary
										</h2>
									</ListGroup.Item>
									{error && (
										<ListGroup.Item>
											<Message
												dismissible
												variant='danger'
												duration={10}>
												{error}
											</Message>
										</ListGroup.Item>
									)}
									<ListGroup.Item>
										<Row>
											<Col>
												<strong>Subtotal</strong>
											</Col>
											<Col>
												{order.itemsPrice.toLocaleString(
													'en-IN',
													{
														maximumFractionDigits: 2,
														style: 'currency',
														currency: 'INR',
													}
												)}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>
												<strong>Total</strong>
											</Col>
											<Col>
												{order.totalPrice.toLocaleString(
													'en-IN',
													{
														maximumFractionDigits: 2,
														style: 'currency',
														currency: 'INR',
													}
												)}
											</Col>
										</Row>
									</ListGroup.Item>
									<>
										<ListGroup.Item>
											{loadingPay && <Loader />}
											<Elements
												stripe={stripePromise}>
												{/* price in paisa */}
												<CheckoutForm
													price={
														order.totalPrice *
														100
													}
													orderID={orderID}
												/>
											</Elements>
										</ListGroup.Item>
									</>
									{userInfo &&
										userInfo.isAdmin &&
										order.isPaid &&
										!order.isDelivered && (
											<ListGroup.Item>
												{loadingDeliver && <Loader />}
												<div className='d-grid'>
													<Button
														type='button'
														variant='info'
														size='lg'
														onClick={
															successDeliveryHandler
														}>
														Confirm Movie Booking
													</Button>
												</div>
											</ListGroup.Item>
										)}
								</ListGroup>
							</Card>
						</Col>
					</>
				)}
			</Row>
		</>
	);
};

export default OrderPage;
