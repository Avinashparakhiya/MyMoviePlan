import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Image, FloatingLabel, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { listMovieDetails, updateMovie } from '../actions/productActions';
import { MOVIE_UPDATE_RESET } from '../constants/productConstants';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { refreshLogin, getUserDetails } from '../actions/userActions';

import FormContainer from '../components/FormContainer';

const ProductEditPage = ({ match, history }) => {
	// all variable for stroing product details
	const productId = match.params.id;

	const [title, setTitle] = useState('');
	const [cinema_name, setCinema_name] = useState('');
	const [genres, setGenres] = useState('');
	const [storyline, setStoryline] = useState('');
	const [posterurl, setPosterurl] = useState('');
	const [price, setPrice] = useState(0.0);

	// to upload product image
	const [uploading, setUploading] = useState(false);
	const [errorImageUpload, setErrorImageUpload] = useState('');
	const dispatch = useDispatch();

	const movieDetails = useSelector((state) => state.movieDetails);
	const { loading, product, error } = movieDetails;

	const movieUpdate = useSelector((state) => state.movieUpdate);
	const {
		loading: loadingUpdate,
		success: successUpdate,
		error: errorUpdate,
	} = movieUpdate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDetails = useSelector((state) => state.userDetails);
	const { error: userLoginError } = userDetails;

	// fetch user login details
	useEffect(() => {
		userInfo
			? userInfo.isSocialLogin
				? dispatch(getUserDetails(userInfo.id))
				: dispatch(getUserDetails('profile'))
			: dispatch(getUserDetails('profile'));
	}, [userInfo, dispatch]);

	// fetch new access tokens if user details fail, using the refresh token
	useEffect(() => {
		if (userLoginError && userInfo) {
			const user = JSON.parse(localStorage.getItem('userInfo'));
			user && dispatch(refreshLogin(user.email));
		}
	}, [userLoginError, dispatch, userInfo]);

	useEffect(() => {
		dispatch(listMovieDetails(productId));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// update the product details in state
	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: MOVIE_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product || product._id !== productId) {
				dispatch(listMovieDetails(productId));
			} else {
				setTitle(product.title);
				setPrice(product.price);
				setPosterurl(product.posterurl);
				setCinema_name(product.cinema_name);
				setGenres(product.genres);
				setStoryline(product.storyline);
			}
		}
	}, [product, dispatch, productId, history, successUpdate]);

	// submit the product details
	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			updateMovie({
				_id: productId,
				title,
				cinema_name,
				price,
				genres,
				storyline,
				posterurl,
			})
		);
	};

	// for image input, use a ref
	const inputFile = useRef(null);

	// click the above ref, to handle the overlay div above the product image
	const handleImageClick = () => {
		inputFile.current.click();
	};

	// submit file to aws bucket, get the url
	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};

			const { data } = await axios.post('/api/upload', formData, config);
			setPosterurl(data);
			setUploading(false);
		} catch (error) {
			setErrorImageUpload('Please choose a valid image');
			setUploading(false);
		}
	};

	return (
		<>
			<Link to='/admin/productlist'>
				<Button variant='outline-primary' className='mt-3'>
					Go Back
				</Button>
			</Link>
			<FormContainer style={{ marginTop: '-2em' }}>
				<h1>Edit Details</h1>
				{loadingUpdate ? (
					<Loader />
				) : errorUpdate ? (
					<Message dismissible variant='danger' duration={10}>
						{errorUpdate}
					</Message>
				) : (
					<>
						{loading ? (
							<Loader />
						) : (
							<Form onSubmit={handleSubmit}>
								{error && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{error}
									</Message>
								)}
								<Form.Group controlId='name'>
									<FloatingLabel
										controlId='nameinput'
										label='Name'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter Name'
											type='text'
											value={title}
											onChange={(e) =>
												setTitle(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='price'>
									<FloatingLabel
										controlId='priceinput'
										label='Price'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter price'
											type='number'
											value={price}
											min='0'
											max='1000'
											step='0.1'
											onChange={(e) =>
												setPrice(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								{errorImageUpload && (
									<Message
										dismissible
										variant='danger'
										duration={10}>
										{errorImageUpload}
									</Message>
								)}
								{uploading ? (
									<div>Uploading...</div>
								) : (
									<Form.Group controlId='image'>
										<Row>
											<Col md={9}>
												<FloatingLabel
													controlId='imageinput'
													label='Image URL'
													className='mb-3'>
													<Form.Control
														size='lg'
														placeholder='Enter image URL'
														type='text'
														value={posterurl}
														onChange={(e) =>
															setPosterurl(
																e.target.value
															)
														}
													/>
												</FloatingLabel>
											</Col>
											<Col md={3}>
												<input
													accept='image/*'
													type='file'
													id='file'
													ref={inputFile}
													onChange={handleFileUpload}
													style={{ display: 'none' }}
												/>
												<div
													className='profile-page-image'
													style={{
														alignSelf: 'center',
													}}>
													<Image
														src={posterurl}
														alt={title}
														title='Click to input file'
														style={{
															width: '100%',
															border: '1px solid #ced4da',
															marginBottom: '1em',
															cursor: 'pointer',
															borderRadius:
																'0.25rem',
														}}
													/>
													<div
														className='image-overlay-product'
														onClick={
															handleImageClick
														}>
														Click to upload image
													</div>
												</div>
											</Col>
										</Row>
									</Form.Group>
								)}
								<Form.Group controlId='brand'>
									<FloatingLabel
										controlId='brandinput'
										label='Multiplx Name'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter brand'
											type='text'
											value={cinema_name}
											onChange={(e) =>
												setCinema_name(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='category'>
									<FloatingLabel
										controlId='categoryinput'
										label='Category'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter category'
											type='text'
											value={genres}
											onChange={(e) =>
												setGenres(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description'
										className='mb-3'>
										<Form.Control as="textarea"
										rows={3}
											size='lg'
											placeholder='Enter description URL'
											type='text'
											 value={storyline}
											onChange={(e) =>
												setStoryline(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								<div className='d-flex'>
									<Button
										type='submit'
										className='my-1 ms-auto'>
										Update Product
									</Button>
								</div>
							</Form>
						)}
					</>
				)}
			</FormContainer>
		</>
	);
};

export default ProductEditPage;
