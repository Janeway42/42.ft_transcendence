import { ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import { getCurrentUsername } from "../../Profile_page/DisplayOneUser/DisplayOneUser.tsx";
import React, { useEffect, useRef, useState } from "react";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const MembersPrivateMessage: React.FC<PropsHeader> = ({ chatClicked }) => {
  const inputRef = useRef(null);

  const [intraName, setIntraName] = useState<string | null>();
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [clickedMember, setClickedMember] = useState<string>();

  useEffect(() => {
    const init = async () => {
      if (!intraName) {
        const currUserIntraName = await getCurrentUsername();
        setIntraName(currUserIntraName);
        console.log("[MembersGroup] JOYCE intraName: ", intraName);
      }
    };
    init();
  }, [intraName]);

  useEffect(() => {
    return () => {
      console.log("[MembersGroup] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned");
      chatClicked = null;
    };
  }, []);

  ////////////////////////////////////////////////////////////////////// UI OUTPUT
  return (
    <>
      {/* Members row */}
      <Row className="me-auto">
        <Stack gap={2}>
          {chatClicked?.usersIntraName &&
            chatClicked?.usersIntraName.map((memberIntraName: string, mapStaticKey: number) => (
              <ListGroup key={mapStaticKey} variant="flush">
                <ListGroup.Item
                  ref={inputRef}
                  as="li"
                  className="justify-content-between align-items-start"
                  variant="light"
                  onClick={() => {
                    setShowMemberModal(true);
                    setClickedMember(memberIntraName);
                  }}
                >
                  {chatClicked?.mutedUsers.indexOf(memberIntraName) == -1 &&
                  chatClicked?.bannedUsers.indexOf(memberIntraName) == -1 ? (
                    <Image
                      src={
                        import.meta.env.VITE_BACKEND + "/resources/member.png"
                      }
                      className="me-1"
                      // id="profileImage_tiny"
                      // roundedCircle
                      width={30}
                      alt="chat"
                    />
                  ) : (
                    <>
                      {chatClicked?.mutedUsers.indexOf(memberIntraName) != -1 && (
                        <Image
                          src={
                            import.meta.env.VITE_BACKEND +
                            "/resources/member-muted.png"
                          }
                          className="me-1"
                          // id="profileImage_tiny"
                          // roundedCircle
                          width={30}
                          alt="chat"
                        />
                      )}
                      {chatClicked?.bannedUsers.indexOf(memberIntraName) != -1 && (
                        <Image
                          src={
                            import.meta.env.VITE_BACKEND +
                            "/resources/member-banned.png"
                          }
                          className="me-1"
                          // id="profileImage_tiny"
                          // roundedCircle
                          width={30}
                          alt="chat"
                        />
                      )}
                    </>
                  )}
                  {chatClicked?.usersProfileName.at(mapStaticKey)}
                </ListGroup.Item>

                {/* Modal with buttons should not appear to the current user */}
                {intraName !== clickedMember && (
                  <>
                    <Modal
                      // size="sm"
                      show={showMemberModal}
                      onHide={() => {
                        setShowMemberModal(false);
                      }}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Member settings</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Button
                          href={
                            import.meta.env.VITE_FRONTEND + "/main_page/game"
                          }
                          // to="/main_page/chat"
                          className="me-3"
                          variant="success"
                        >
                          Invite to play pong!
                        </Button>
                        <Button
                          className="me-3"
                          href={
                            import.meta.env.VITE_FRONTEND + "/main_page/users"
                          }
                          variant="primary"
                          // onClick={ () => setShow(false)}
                        >
                          Go to profile
                        </Button>
                      </Modal.Body>
                    </Modal>
                  </>
                )}
              </ListGroup>
            ))}
        </Stack>
      </Row>
    </>
  );
};

export default MembersPrivateMessage;