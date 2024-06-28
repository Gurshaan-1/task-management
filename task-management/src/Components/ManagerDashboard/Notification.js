import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import notification from "../../assets/notification.png"
import axios from "axios";

const Notification = () => {
  const [notificationText, setNotificationText] = useState("");
  const [recipient, setRecipient] = useState("");
  const [users, setUsers] = useState([]);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3001/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleNotificationTextChange = (event) => {
    setNotificationText(event.target.value);
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      try {
        await axios.post("http://localhost:3001/notifications", {
          recipient: recipient, // Update to recipient name
          notificationText: notificationText,
        });

        // Reset form fields
        setNotificationText("");
        setRecipient("");
        setValidated(false);
        alert("Notification sent Successfully!")
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    } else {
      setValidated(true);
    }
  };

  return (
    <div className="notification-container">
      <div className="notification-left">
      <h3 className="title">Send Notification: </h3>
      <hr/>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group controlId="notificationText">
          <Form.Label>Notification Text:</Form.Label>
          <Form.Control
            type="text"
            value={notificationText}
            onChange={handleNotificationTextChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please enter the notification text.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="recipient">
          <Form.Label>Recipient:</Form.Label>
          <Form.Control
            as="select"
            value={recipient}
            onChange={handleRecipientChange}
            required
          >
            <option value="">Select Recipient</option>
            {users?.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            Please select a recipient.
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
      </div>
      <div className="notification-right">
        <img src={notification} alt="img" />
      </div>
      
    </div>
  );
};

export default Notification;
