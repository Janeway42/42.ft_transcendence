import React, { useState, useEffect } from "react";
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";
import { CurrUserData } from "./Center/Profile/utils/contextCurrentUser.tsx";
import { checkIfUserExistsInDB } from "./Center/Profile/utils/checkIfUserExistsInDB.tsx";
import { Container } from "react-bootstrap";
import { CustomSpinner } from "./Other/Spinner.tsx";
import { chatSocket } from "./Center/Chat/Utils/ClientSocket.tsx";

interface ContextProps {
  updateContext: (updateUserData: CurrUserData) => void;
}

const MainPage: React.FC<ContextProps> = ({ updateContext }) => {
  console.log(" -------- MAIN PAGE: ---------");

  const [userData, setUserData] = useState<CurrUserData | null>(null);

  useEffect(() => {
    if (!chatSocket.connected) {
      chatSocket.connect();
      chatSocket.on("connect", () => {
        console.log(
          "[Main_page] socket connected: ",
          chatSocket.connected,
          " -> socket id: ",
          chatSocket.id
        );
      });
    }
  },[]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await checkIfUserExistsInDB();
        if (response && response.user) {
          setUserData({
            loginName: response.user.loginName,
            profileName: response.user.profileName,
            profileImage: response.user.profileImage,
          });
          // Update Local Storage:
          localStorage.setItem("profileName", response.user.profileName || "");
          localStorage.setItem("profileImage", response.user.profileImage || "");
          //updateContext(response.user);
          console.log("Current user context updated: " + userData?.loginName);
          if (userData !== null)
            updateContext(userData);
          // const { loginName } = useContext(CurrentUserContext);
          // console.log("Current user context updated: " + userData?.loginName);
          // console.log("Current user context updated: " + response.user.loginName);
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Detailed error:", error);
        }
        console.error("Error checking if user exists in DB. Please try again later.");
      }
    };
    fetchUserData();
  }, [updateContext]);


  if (!userData) {
    return (
      <Container  className='d-flex justify-content-center align-items-center'
                  style={{ width: "100vw", height: "100vh" }}>
        <CustomSpinner />
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Center />
    </>
  );
};

export default MainPage;
