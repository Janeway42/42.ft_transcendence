import axios from 'axios';
import { useNavigate } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import { Navbar, Container, Nav, Col, Image, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { CurrentUserContext } from '../Center/Profile_page/contextCurrentUser';
import '../../css/Header.css'
// import {  Tab, Tabs, NavDropdown, Row, Badge, Form } from 'react-bootstrap';
// import { UserService } from '../../user/user.service';

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:


/*
	I made some changes in the Header.tsx, because we need the browser to have history of going to different components, by clicking back and forth arrows, and now it was not doing it.

	There is a difference between <NavLink> and <NavLink>
	The first is from React, and the second from Bootstrap.
	We need to use the <NavLink> to enable the browser history.

	On top of this, each button also needs a property to='/chat'
	If we use 'to', then we don't need 'eventKey', so I removed them.

	The 'className' can remain, I just added a condition 'isActive', to change the style, if active

*/





type PropsHeader = {
  functionToCall: (content: null | string) => void;  // setActiveContent() in main_page
};

// When Header component is (re)loaded, user data is pulled from Intra.
//      Maybe this is not necessary each time
// const Header: React.FC<PropsHeader> = ({ functionToCall }) => {
const Header: React.FC = () => {

	console.log('Start Header ...');
	
	// const handleClick = (content: null | string) => {
		// functionToCall(content);  //    ( setActiveContent() in main_page )
	// };
	
	// Logging out button: 
	//      The path '/logout' starts the component <LogoutPage>, there it goes to backend /auth/logout,
	//      After returning from backend, it navigates to '/' LoginPage        
	const navigate = useNavigate();
	const handleLogoutClick = () => {
		navigate('/logout');
	}

	// const location = useLocation();
	// useEffect(() => {
	// 	handleClick(location.pathname.slice(1));
	// }, [location]);


	// Get Current User Info from CONTEXT
	const currUserData = useContext(CurrentUserContext);
	if (!currUserData) {
		console.log('Error from Header.tsx: no Current User Data');
		return null;  // will this be needed ?
	}

	// here everything is still 'undefined':
	console.log('Header: currUserData.loginName: ', currUserData?.loginName);
	console.log('Header: currUserData.profileName: ', currUserData?.profileName);
	console.log('Header: currUserData.loginImage: ', currUserData?.loginImage);

	
	// THE CORRECT PATH FOR STORED IMAGES, EXAMPLE:
	//  src={`http://localhost:3001/uploads/jmurovec-4d1c6f5c-2f78-49fc-9f11-0a3488e2c665.jpg`}
	//  IN main.ts NEEDS TO BE ENABLED THE CORRECT FOLDER: app.use(...)
	const image = 'http://localhost:3001/' + localStorage.getItem('profileImage') || undefined;
	// const image = localStorage.getItem('profileImage') || undefined;
	console.log('Local Storage Image: ', image);

	return (
		<Navbar bg="light" data-bs-theme="light" sticky="top" className="border-bottom">
			<Container fluid>

				{/* Profile Image */}
				<Col className='col-md-1 position-relative'>
					<Navbar.Brand href="#profile" className="position-absolute top-50 start-50 translate-middle">
						<Image
							src={image}
							// src={`http://localhost:3001/uploads/jmurovec-4d1c6f5c-2f78-49fc-9f11-0a3488e2c665.jpg`}
							// src={currUserData?.loginImage ?? ''}
							className="me-auto"
							width={50}
							height={50}
							alt="MyImage"
							roundedCircle
						/>
					</Navbar.Brand>
				</Col>

				{/* Header Center */}
				<Col className='col-md-10'>
					<Nav
						defaultActiveKey="profile"
						// onSelect={(k) => handleClick(k)}
						fill
						// variant="tabs"		// just different styling
						variant="underline"
					>
						<Nav.Item>
							<NavLink
								// eventKey="profile"
								// onClick={ () => handleClick('profile') }
								to="profile"
								className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
								>
								{ localStorage.getItem('profileName') }
							</NavLink>
						</Nav.Item>
						<Nav.Item>
							<NavLink
								// eventKey="chat"
								// onClick={ () => handleClick('profile')
								to="chat"
								className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
								> Chat
							</NavLink>
						</Nav.Item>

						<Nav.Item>
							<NavLink
								// eventKey="users"
								// onClick={ () => handleClick('profile') }
								to="users"
								className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
								> Users
							</NavLink>
						</Nav.Item>

						<Nav.Item>
							<NavLink
								// eventKey="game"
								// onClick={ () => handleClick('profile')
								to="game"
								className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
								> Game
							</NavLink>
						</Nav.Item>
					</Nav>
				</Col>

				{/* Logout */}
				<Col className='col-md-1'>
					<Nav className="justify-content-end">
						<Button
							// onSelect={() => logout()}
							variant="outline-warning"
							onClick={ handleLogoutClick }
						>
							Logout
						</Button>
					</Nav>
				</Col>
			</Container>
		</Navbar>
	);
};

export default Header;