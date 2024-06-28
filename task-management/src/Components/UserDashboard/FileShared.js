import axios from "axios";
import React, { useEffect, useState } from "react";
import { Badge, Button, ListGroup } from "react-bootstrap";
import { BiTaskX } from "react-icons/bi";
import { TbFilesOff } from "react-icons/tb";

function FileShared() {
  const [files, setfiles] = useState();
  useEffect(() => {
    getfiles();
  }, []);

  const getfiles = async () => {
    const params = new URLSearchParams(window.location.search);
    const usernameParam = params.get("name");
    console.log(usernameParam);
    await axios
      .get(`http://127.0.0.1:3001/files/${usernameParam}`)
      .then((response) => {
        console.log(response.data);
        setfiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  };


  const downloadFile = async (fileId, filename) => {
    try {
      // Send a request to download the file
      const response = await axios.get(
        `http://127.0.0.1:3001/files/download/${filename}`,
        {
          responseType: "blob", // Set the responseType to 'blob' to handle binary data
        }
      );

      // Create a URL object from the blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      // Append the anchor element to the body and trigger a click event
      document.body.appendChild(link);
      link.click();

      // Clean up by removing the anchor element and revoking the URL object
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
const openFile = (fileId, filename) => {
  // // Determine the file extension
  const extension = filename.split(".").pop().toLowerCase();

  // Map common file types to their MIME types
  const mimeTypeMap = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Add more mappings for other file types as needed
  };

  // Get the MIME type for the file extension
  const mimeType = mimeTypeMap[extension];

  if (mimeType) {
    // Open the file in a new tab/window
    window.open(`http://127.0.0.1:3001/uploads/${filename}`, "_blank", "noreferrer");
  } else {
    console.error(`Unsupported file type: ${extension}`);
  }
};

  return (
    <div className="noti-container">
      <h4>Files :</h4>
      <hr />
      <ListGroup>
        {files?.length == 0 ? (
          <div className="optional title">
            <TbFilesOff /> No Files
          </div>
        ) : (
          files?.map((file) => (
            <ListGroup.Item
              key={file._id}
              className="d-flex justify-content-between align-items-center m-3"
            >
              <div>
                <strong>{file.filename}</strong>
              </div>
              <div></div>
              <Button
                variant="primary"
                onClick={() => openFile(file._id, file.filename)}
              >
                Open
              </Button>
              <Button
                variant="primary"
                onClick={() => downloadFile(file._id, file.filename)}
              >
                Download
              </Button>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
}

export default FileShared;
