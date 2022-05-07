import React from 'react';
import { Link } from 'react-router-dom';
import { Card ,ListGroup} from 'react-bootstrap';
import '../styles/product.css';

const Product = ({ product }) => {
	return (
		<Card className='mt-3 p-0'>
			<Link to={`/product/${product._id}`}>
				<Card.Img
					loading='lazy'
					className='product-image'
					src={product.posterurl}
					variant='top'
					alt={product.title}
					width='100px'
					height='250px'
				/>
			</Link>

			<Card.Body>
				<Link
					to={`/product/${product._id}`}
					style={{ color: 'dimgray', textDecoration: 'none' }}>
					<Card.Title className='product-title' as='p'>
						<strong>{product.title}</strong>
						<br></br>
						<strong>Categories:</strong>{' '}
									{product.genres}
					</Card.Title>
				</Link>
				<Card.Text as='h4'>
					{product.price &&
						product.price.toLocaleString('en-IN', {
							maximumFractionDigits: 2,
							style: 'currency',
							currency: 'INR',
						})}
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default Product;
