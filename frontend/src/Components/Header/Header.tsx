import React, { useContext, useState } from "react";
import { Modal, Navbar, Container, Nav, Col, Image } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { CurrentUserContext } from "../Center/Profile/utils/contextCurrentUser.tsx";
import "../../css/Header.css";
import { chatSocket } from "../Center/Chat/Utils/ClientSocket.tsx";
// import {  Tab, Tabs, NavDropdown, Row, Badge, Form } from 'react-bootstrap';
// import { UserService } from '../../user/user.service';

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:

/*
	I made some changes in the Header.tsx, because we need the browser to have history of going to different components, by clicking back and forth arrows, and now it was not doing it.

	There is a difference between <NavLink> and <Nav.Link>
	The first is from React, and the second from Bootstrap.
	We need to use the <NavLink> to enable the browser history.

	On top of this, each button also needs a property to='/chat'
	If we use 'to', then we don't need 'eventKey', so I removed them.

	The 'className' can remain, I just added a condition 'isActive', to change the style, if active
*/

const Header: React.FC = () => {
  // Logging out button:
  //      The path '/logout' starts the component <LogoutPage>, there it goes to backend /auth/logout,
  //      After returning from backend, it navigates to '/' LoginPage
  // const navigate = useNavigate();
  // const handleLogoutClick = () => {
  // 	console.log('LOGOUT: click navigate("/logout")');
  // 	navigate('/logout');
  // }

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  // Get Current User Info from CONTEXT
  const currUserData = useContext(CurrentUserContext);
  if (!currUserData) {
    console.log("Error from Header.tsx: no Current User Data");
    return null; // will this be needed ?
  }

  // here everything is still 'undefined':
  console.log("Header: currUserData.loginName: ", currUserData?.loginName);
  console.log("Header: currUserData.profileName: ", currUserData?.profileName);
  console.log("Header: currUserData.loginImage: ", currUserData?.profileImage);

  // THE CORRECT PATH FOR STORED IMAGES, EXAMPLE:
  const image =
    import.meta.env.VITE_BACKEND + "/" + localStorage.getItem("profileImage") ||
    undefined;

  // const image = 'http://localhost:3001' + '/' + localStorage.getItem('profileImage') || undefined;
  //  IN main.ts NEEDS TO BE ENABLED THE CORRECT FOLDER: app.use(...)

  const connectToChatSocket = () => {
    console.log("[Header] connectToChatSocket");
    if (!chatSocket.connected) {
      chatSocket.connect();
      chatSocket.on("connect", () => {
        console.log(
          "[Header] socket connected: ",
          chatSocket.connected,
          " -> socket id: " + chatSocket.id
        );
      });
      chatSocket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          console.log("[Header] socket disconnected: ", reason);
          // the disconnection was initiated by the server, you need to reconnect manually
          chatSocket.connect();
        }
        // else the socket will automatically try to reconnect
      });
    } else {
      console.log(
        "[Header] socket connected: ",
        chatSocket.connected,
        " -> socket id: " + chatSocket.id
      );
    }
  };

  return (
    <Navbar
      bg="light"
      data-bs-theme="light"
      sticky="top"
      className="border-bottom"
    >
      <Container fluid>
        {/* Profile Image */}
        <Col className="col-md-1 position-relative">
          <Navbar.Brand
            href="#profile"
            className="position-absolute top-50 start-50 translate-middle"
            onClick={toggleModal}
          >
            <Image
              src={image}
              className="me-auto"
              width={50}
              height={50}
              alt="profile-icon"
              roundedCircle
            />
          </Navbar.Brand>
        </Col>

        {/* Header Center */}
        <Col className="col-md-10">
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
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {localStorage.getItem("profileName")}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                // eventKey="chat"
                onClick={connectToChatSocket}
                to="chat"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {" "}
                Chat
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                // eventKey="users"
                // onClick={ () => handleClick('profile') }
                to="users"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {" "}
                Users
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink
                // eventKey="game"
                // onClick={ () => handleClick('profile')
                to="game"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {" "}
                Game
              </NavLink>
            </Nav.Item>

            {/* Logout */}
            <Nav.Item>
              <NavLink
                to="/logout"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "btn btn-outline-warning"
                }
              >
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Col>

        <Modal show={showModal} onHide={toggleModal} centered size="lg">
          <Modal.Body>
            <Image src={image} alt="profile-image" className="img-fluid" />
          </Modal.Body>
        </Modal>
      </Container>
    </Navbar>
  );
};

export default Header;
