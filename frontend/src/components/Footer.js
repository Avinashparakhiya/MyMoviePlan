import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/footer.css';

const Footer = () => {
	return (
		<Container>
			<footer className='footer-container'>
				<div className='footer-copyright'>&copy;2021 Avinash Parakhiya MyMoviePlan</div>
			</footer>
		</Container>
	);
};

export default Footer;
