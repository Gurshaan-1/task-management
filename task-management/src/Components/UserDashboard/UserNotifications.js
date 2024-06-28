import axios from "axios";
import React, { useEffect, useState } from "react";
import {  Button, ListGroup } from 'react-bootstrap';
import { BiTaskX } from 'react-icons/bi';
import { IoIosNotificationsOff } from "react-icons/io";

function UserNotifications() {
  const [notifications, setNotifications] = useState();
  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const params = new URLSearchParams(window.location.search);
    const usernameParam = params.get("name");
    console.log(usernameParam);
    await axios
      .get(`http://127.0.0.1:3001/notifications/${usernameParam}`)
      .then((response) => {
        console.log(response.data);
        setNotifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  const deleteNotification = async (id) => {
    await axios
      .delete(`http://127.0.0.1:3001/notifications/${id}`)
      .then((response) => {
        console.log(response);
        getNotifications();
      })
      .catch((error) => {
        console.error("Error deleting notifications:", error);
      });
  };

  return (
    <div className="noti-container">
      <h4>Notifications :</h4>
      <hr />
      <ListGroup>
        {notifications?.length === 0 ? (
          <div className="optional title">
            <IoIosNotificationsOff /> No Notifications
          </div>
        ) : (
          notifications?.map((notification) => (
            <ListGroup.Item
              key={notification._id}
              className="d-flex justify-content-between align-items-center m-3"
            >
              <div>
                <strong>{notification.notificationText}</strong>
              </div>
              <div>
                <p></p>

                <Button
                  variant="warning"
                  size="sm"
                  className="ml-auto"
                  onClick={() => deleteNotification(notification._id)}
                >
                  Close
                </Button>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
}

export default UserNotifications;
