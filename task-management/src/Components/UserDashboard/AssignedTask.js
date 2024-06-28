import React, { useState, useEffect } from "react";
import { ListGroup, Badge, Button } from "react-bootstrap";
import { BiTaskX } from "react-icons/bi";
import axios from "axios";

function AssignedTask() {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async() =>{
    const params = new URLSearchParams(window.location.search);
    const usernameParam = params.get("name");
    console.log(usernameParam);
    await axios
      .get(`http://127.0.0.1:3001/tasks/${usernameParam}`)
      .then((response) => {
        console.log(response);
        setAssignedTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }

  const handleStatusChange = async (taskId) => {
    const updatedTasks = assignedTasks.map((task) =>
      task._id === taskId
        ? { ...task, completed: task.completed === false ? true : false }
        : task
    );
    setAssignedTasks(updatedTasks);
    const updatedStatus = updatedTasks.find(
      (task) => task._id === taskId
    )?.completed;
    await axios
      .put(`http://127.0.0.1:3001/tasks/${taskId}/status`, {
        completed: false ? !updatedStatus : updatedStatus,
      })
      .then((response) => {
        if (response.status === 200) {
        }
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  const formatDate = (dateString) => {
    const deadlineDate = new Date(dateString);
    const year = deadlineDate.getFullYear();
    const month = String(deadlineDate.getMonth() + 1).padStart(2, "0");
    const day = String(deadlineDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="container-task">
      <div className="task-container">

      <h4>Assigned Tasks</h4>
      <ListGroup>
      {assignedTasks?.length == 0 ? (
  <div className="optional title"><BiTaskX/> No assigned task</div>
) : (
  assignedTasks?.map((task) => (
    task.completed === false && (
      <ListGroup.Item
        key={task._id}
        className="d-flex justify-content-between align-items-center m-3"
      >
        <div>
          <strong>{task.name}</strong>
          <br />
          <small>Deadline: {formatDate(task.deadline)}</small>
          <br />
          <small>Priority: {task.priority}</small>
          <br />
          <small>Notes: {task.notes}</small>
        </div>
        <div>
          <Badge variant={task.completed === false ? "warning" : "success"}>
            {task.completed === false ? "In Progress" : "Completed"}
          </Badge>
          <p></p>
          {task.completed === false ? (
            <Button
              variant="warning"
              size="sm"
              className="ml-auto"
              onClick={() => handleStatusChange(task._id)}
            >
              Complete
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              className="ml-auto"
              onClick={() => handleStatusChange(task._id)}
            >
              Reopen
            </Button>
          )}
        </div>
      </ListGroup.Item>
    )
  ))
)}

      </ListGroup>
      </div>
      <div className="task-container">

      <h4>Completed Tasks</h4>
      <ListGroup>
      {assignedTasks?.length == 0 ? (
  <div className="optional title"><BiTaskX/> No completed task</div>
) : (
  assignedTasks?.map((task) => (
    task.completed === true && (
      <ListGroup.Item
        key={task._id}
        className="d-flex justify-content-between align-items-center m-3"
      >
        <div>
          <strong>{task.name}</strong>
          <br />
          <small>Deadline: {formatDate(task.deadline)}</small>
          <br />
          <small>Priority: {task.priority}</small>
          <br />
          <small>Notes: {task.notes}</small>
        </div>
        <div>
          <Badge variant={task.completed === false ? "warning" : "success"}>
            {task.completed === false ? "In Progress" : "Completed"}
          </Badge>
          <p></p>
          {task.completed === false ? (
            <Button
              variant="warning"
              size="sm"
              className="ml-auto"
              onClick={() => handleStatusChange(task._id)}
            >
              Complete
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              className="ml-auto"
              onClick={() => handleStatusChange(task._id)}
            >
              Reopen
            </Button>
          )}
        </div>
      </ListGroup.Item>
    )
  ))
)}
      </ListGroup>
      </div>
    </div>
  );
}

export default AssignedTask;
