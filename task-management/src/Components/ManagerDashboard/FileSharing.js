import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import fileSharing from "../../assets/filesharing.avif";
import axios from "axios";

const FileSharing = () => {
  const [fileSelect, setfileSelect] = useState("");
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

 const handleFileUpload = (event) => {
   const file = event.target.files[0]; // Get the first file from the list of selected files
console.log(file);
   setfileSelect(file);
 };


  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      const formData = new FormData();
      formData.append("file", fileSelect); // selectedFile is the file object
      formData.append("recipient", recipient);

      try {
        await axios.post("http://localhost:3001/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setRecipient("");
        setfileSelect(null);
        setValidated(false);
        alert("File uploaded and details sent Successfully!");
      } catch (error) {
        console.error("Error uploading file and sending details:", error);
      }
    } else {
      setValidated(true);
    }
  };


  return (
    <div className="notification-container">
      <div className="notification-right">
        <img src={fileSharing} alt="img" />
      </div>
      <div className="notification-left">
        <h3 className="title">Share Files: </h3>
        <hr />
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="notificationText">
            <Form.Label>Select File:</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileUpload}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please select the File.
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
    </div>
  );
};

export default FileSharing;
