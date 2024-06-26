// import React, { useState, useEffect, Req, Res } from "react";
// import axios from "axios";
// import { data } from "jquery";
// import MainPage from "../main_page";
// import LoginPage from "./Login_auth";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import { useNavigate } from "react-router-dom"; // added jaka, to navigate to mainPage, if code is correct

// const sendCode = async () => {
// 	console.log("Verification email sent:");
// 	try {
// 		const response = await axiosInstance.post(
// 			"http://localhost:3001/2fa/send_tfa_code"
// 			);
// 			console.log("email sent, response.data:", response.data);
// 		} catch (error) {
// 			console.error("Error sending verification email:", error);
// 		}
// 	};

// 	const InputTFAcode = () => {
// 	const [tfaAttempts, setAttempts] = useState<number>(0);
// 	const [tfa, settfa] = useState(false);
// 	const [clicked, setClicked] = useState("");
// 	const [inputValue, setInputValue] = useState("");
// 	const navigate = useNavigate();

//   let axiosConfig = {
// 	headers: {
// 	  // 'Content-Type': 'application/json;charset=UTF-8',
// 	  // "Access-Control-Allow-Origin": "http://localhost:3000",
// 	},
//   };

//   const tfaBackend = async (e: React.FormEvent) => {
// 	e.preventDefault();
// 	try {
// 	  const response = await axiosInstance.post(
// 		"http://localhost:3001/2fa/verify_code",
// 		{ inputValue },
// 		axiosConfig
// 	  );
// 	  console.log("response tfa: " + tfa);
// 	  settfa(response.data);

// 	  if (response.data === true && tfaAttempts < 3) {
// 		navigate("/main_page/profile");
// 	  }
// 	  else {
// 		setAttempts(tfaAttempts + 1);
// 		//console.log("Input TfaCode response: ", JSON.stringify(response));
// 		if (tfaAttempts + 1 === 3){
// 			const responseCleanCookies = await axiosInstance.get(
// 				"http://localhost:3001/auth/cleanToken",
// 				axiosConfig
// 			  );
// 			  console.log("clean Token response: " + responseCleanCookies.cookie);
// 		}
// 	  }
// 	} catch (error) {
// 	  console.error("Input TfaCode error: ", error);
// 	}
//   };

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		console.log("clicked: " + clicked);
// 		if(clicked === "sendEmail"){
// 			sendCode();
// 			console.log("email supposedly sent");
// 		}
// 		if(clicked === "verifyCode"){
// 			tfaBackend(e);
// 			setInputValue('');
// 		}
// 	};

//   return (
// 	<>
// 	  {tfa === false && tfaAttempts + 1 === 3 && <LoginPage />}
// 	  {tfa === false && tfaAttempts < 3 && (
// 		<>
// 		  <div>
// 			<h4>Two Factor Authentication</h4><br></br>
// 			<h5>
// 				{tfa === false && tfaAttempts === 2 && "Last chance! Screw this one up and go back to start!"}
// 				{tfa === false && tfaAttempts === 1 && "Careful, I'm loosing my patience!"}
// 				{tfa === false && tfaAttempts === 0 && "Click 'Send Code' to receive a code. Click 'Verify Code' to see if we'll let you in!"}
// 			</h5>
// 				<Form.Group>
// 					<Form.Control
// 					type="text"
// 					placeholder="your code here"
// 					value={inputValue}	// reset the field to empty
// 					onChange={(e) => setInputValue(e.target.value)}
// 					onSubmit={handleSubmit}/>
// 				</Form.Group>
// 				<Button type="submit" onClick={() => {setClicked("sendEmail")}}>
// 			  	Send Email
// 				</Button> <></>
// 				<Button type="submit" onClick={() => {setClicked("verifyCode")}}>
// 			  	Verify Code
// 				</Button>
// 		  </div>
// 		</>
// 	  )}
// 	</>
//   );
// };

// export default InputTFAcode;

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import axiosInstance from "../Other/AxiosInstance";
import LoginPage from "./Login_auth";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, Navigate } from "react-router-dom";
import { checkIfLoggedIn } from "./checkIfLoggedIn";

const re_sendVerificationEmail = async () => {
  console.log("Re-send Verification email:");
  try {
    const response = await axiosInstance.post(
      "/2fa/resend_email_code" // TO DO - change to env variable
    );
    console.log("    email sent, response.data:", response.data);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

const InputTFAcode = () => {
  const [inputValue, setInputValue] = useState("");
  const [tfa, settfa] = useState(false);
  const [tfaAttempts, setAttempts] = useState<number>(0);
  const navigate = useNavigate();


	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	checkIfLoggedIn(setIsLoggedIn, setIsCheckingAuth);

  if (isCheckingAuth) {
    console.log("              Login_2fa: Checking if logged in ...");
    return <div> Checking if you are logged in ...</div>
  } 

	// useEffect(() => {
  //   // Checking if already logged in, in case a user types the url / or /login_2ta, if yes, it redirects to the profile page
	// 	const checkAuthStatus = async () => {
	// 		try {
	// 			const storageProfileName = localStorage.getItem('profileName');
	// 			if (storageProfileName) {
	// 				const response = await axiosInstance.get("/users/get-current-user");
	// 				if (response.data == "")
	// 					console.log('       Response.data is empty!!! No AUTH	', response.data);
	// 				else {
	// 					console.log('       Response.data:', response.data);	
	// 					if (response.data.profileName === storageProfileName) 
	// 						setIsLoggedIn(true);
	// 				}
	// 			}
	// 		} catch (error) {
	// 			// do nothing:
	// 			console.error('Login_2fa: The user is logged out (Auth status check failed)');
	// 		} finally {
	// 			setIsCheckingAuth(false);
	// 		}
	// 	}
	// 	checkAuthStatus();
	// }, []);

    if (isCheckingAuth) {
      console.log("              Login_2fa: Checking if logged in ...");
      return <div> Checking if you are logged in ...</div>
    } 


  let axiosConfig = {
    headers: {
      // 'Content-Type': 'application/json;charset=UTF-8',
      // "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  };

  const tfaBackend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(document.cookie);
      const response = await axiosInstance.post(
        "/2fa/verify_code", // TO DO change to the env variable
        { inputValue },
        axiosConfig
      );
      console.log("response tfa: " + tfa);
      settfa(response.data);

      if (response.data === true && tfaAttempts < 3) {
        navigate("/main_page/profile");
      } else {
        setAttempts(tfaAttempts + 1);
        // console.log("Input TfaCode response: ", JSON.stringify(response));
        if (tfaAttempts + 1 === 3) {
          console.log("Supposedly cleaning cookies on the backend");
          const responseCleanCookies = await axiosInstance.get(
            "/auth/logout", // TO DO change to the environment variable
            axiosConfig
          );
          console.log(
            "clean Token response:  responseCleanCookies.status: " +
              responseCleanCookies.status
          );
          //   console.log("clean Token data: " + responseCleanCookies.data);
          //   console.log("clean Token statustext: " + responseCleanCookies.statusText);
        } else re_sendVerificationEmail();
      }
    } catch (error) {
      console.error("Input TfaCode error: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    tfaBackend(e);
    setInputValue("");
  };

  return (
    isLoggedIn ? <Navigate to="/main_page/profile" />
			   :
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      {tfa === false && tfaAttempts === 3 && <LoginPage />}
      {tfa === false && tfaAttempts < 3 && (
        <div>
          <h1>Unfriendly Ping Pong</h1>
          <br></br>
          <h4>Two Factor Authentication</h4>
          <h6>
            {tfa === false &&
              tfaAttempts === 1 &&
              "New code has been sent. Careful, I'm running out of patience!"}
            {tfa === false &&
              tfaAttempts === 2 &&
              "Last attempt! Screw this one up and we're done playing!"}
            {tfa === false &&
              tfaAttempts === 0 &&
              "Check your email and enter the code to see if we'll let you in!"}
          </h6>
          <Form onSubmit={handleSubmit}>
            <Row className="align-items-center">
              <Col>
                <Form.Group>
                  <Form.Control
                    className="input-default"
                    type="text"
                    placeholder="your code here"
                    value={inputValue} // reset the field to empty
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs="auto">
                <Button
                  className="button_default"
                  type="submit"
                  // onClick={handleSubmit}
                >
                  Verify Code
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default InputTFAcode;
