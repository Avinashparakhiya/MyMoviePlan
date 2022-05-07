/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	Card,
	Button,
	ListGroup,
} from 'react-bootstrap';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
	listMovieDetails,
} from '../actions/productActions';
import { listMyOrders } from '../actions/orderActions';
import { refreshLogin, getUserDetails } from '../actions/userActions';
import '../styles/product-page.css';

const ProductPage = ({ history, match }) => {
	const [quantity, setQuantity] = useState(1);
	const [hasOrderedItem, setHasOrderedItem] = useState(false);
	const dispatch = useDispatch();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const movieDetails = useSelector((state) => state.movieDetails);
	const {  product, error } = movieDetails;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	const orderListUser = useSelector((state) => state.orderListUser);
	const { orders } = orderListUser;
	// fetch user login info
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// refresh the access tokens for accessing user details
	useEffect(() => {
		if (userLoginError && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		dispatch(listMyOrders());
	}, [dispatch]);


	useEffect(() => {
		dispatch(listMovieDetails(match.params.id));
	}, [match, dispatch]);

	useEffect(() => {
		if (orders && orders.length) {
			let flag = 0; // to check is this user has ordered this item
			for (let obj of orders) {
				for (let ele of obj.orderItems) {
					if (ele.product.toString() === match.params.id) {
						flag = 1;
						break;
					}
				}
			}
			flag ? setHasOrderedItem(true) : setHasOrderedItem(false);
		} else {
			setHasOrderedItem(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orders]);

	const handleAddToCart = (e) => {
		history.push(`/cart/${match.params.id}?qty=${quantity}`);
	};

	return (
		<>
			<Link className='btn btn-outline-primary my-2' to='/'>
				Go Back
			</Link>
			{product && (!product._id || product._id !== match.params.id) ? (
				<Loader />
			) : error ? (
				<Message dismissible variant='danger' duration={10}>
					{error}
				</Message>
			) : product ? (
				<>
					<Meta title={`${product.title}`} />
					<Row>
						<Col md={6}>
							<img
								src={product.posterurl}
								alt={product.title}
								title={product.title}
							/>
						</Col>
						<Col md={3}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h3>{product.title}</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<strong>Price: </strong>
									{product.price &&
										product.price.toLocaleString('en-IN', {
											maximumFractionDigits: 2,
											style: 'currency',
											currency: 'INR',
										})}
								</ListGroup.Item>
								<ListGroup.Item>
									<strong>Description:</strong>{' '}
									{product.storyline}
								</ListGroup.Item>
								<ListGroup.Item>
									<strong>Multiplex Name:</strong>{' '}
									{product.cinema_name}
								</ListGroup.Item>
								<ListGroup.Item>
									<strong>Categories:</strong>{' '}
									{product.genres}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<Row>
											<Col>
												<strong>Price: </strong>
											</Col>
											<Col>
												{product.price &&
													product.price.toLocaleString(
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
								</ListGroup>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<Row>
											<Button
												onClick={handleAddToCart}
												type='button'
												className='btn-block btn-lg'
												>
												Add To Cart
											</Button>
										</Row>
									</ListGroup.Item>
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			) : (
				''
			)}
		</>
	);
};

export default ProductPage;
