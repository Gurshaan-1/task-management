import React, { useEffect, useState } from "react";
import axios from "axios";
import UserHeader from "../UserDashboard/UserHeader";
import projectImage from "../../assets/project-management.png";
import {
  Container,
  Button,
  Form,
  ListGroup,
  ListGroupItem,
  Card,
  Badge,
  Dropdown,
} from "react-bootstrap";
import Notification from "./Notification";
import FileSharing from "./FileSharing";

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newTeamMember, setNewTeamMember] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [editDeadlineTaskId, setEditDeadlineTaskId] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  // const [selectedMembers, setSelectedMembers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showNames, setShowNames] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3001/users");
      setTeamMembers(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter member list based on search query
  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setNewDeadline(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setNewPriority(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  useEffect(() => {
    getTask();
  }, []);

  const getTask = async () => {
    await axios
      .get("http://127.0.0.1:3001/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    const task = {
      name: newTask,
      deadline: newDeadline,
      priority: newPriority,
      assignedMembers: selectedMembers,
      notes: newNote,
      completed: false,
    };

    axios
      .post("http://127.0.0.1:3001/tasks", task)
      .then((response) => {
        if (response.status === 201) {
          const newTaskId = response.data.id;
          setNewTask("");
          setNewDeadline("");
          setNewPriority("");
          setNewTeamMember([]);
          setNewNote("");
          console.log(newTaskId);
          // Fetch the updated list of tasks
          axios
            .get("http://127.0.0.1:3001/tasks")
            .then((response) => {
              setTasks(response.data);
            })

            .catch((error) => {
              console.error("Error fetching tasks:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error creating task:", error);
      });
  };

  const formatDate = (dateString) => {
    const deadlineDate = new Date(dateString);
    const year = deadlineDate.getFullYear();
    const month = String(deadlineDate.getMonth() + 1).padStart(2, "0");
    const day = String(deadlineDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCompleteTask = async (taskId) => {
    // console.log(taskId)
    const updatedTasks = tasks.map((task) =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    await axios
      .put(`http://localhost:3001/tasks/${taskId}/completed`, {
        completed: updatedTasks.find((task) => task._id === taskId)?.completed,
      })
      .then((response) => {
        if (response.status === 200) {
          // Task completion status updated successfully
        }
      })
      .catch((error) => {
        console.error("Error updating task completion status:", error);
      });
  };
  const handleCheckboxChange = (membername) => {
    if (selectedMembers.includes(membername)) {
      setSelectedMembers(selectedMembers.filter((name) => name !== membername));
    } else {
      setSelectedMembers([...selectedMembers, membername]);
    }
  };

  const handleEditDeadline = (taskId) => {
    setEditDeadlineTaskId(taskId);
  };

  const handleEditDeadlineSubmit = (taskId) => {
    const updatedTask = {
      deadline: editDeadline,
    };

    axios
      .put(`http://localhost:3001/tasks/${taskId}/deadline`, updatedTask)

      .then((response) => {
        if (response.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, deadline: editDeadline } : task
            )
          );
          setEditDeadlineTaskId("");
          setEditDeadline("");
        }
      })
      .catch((error) => {
        console.error("Error updating deadline:", error);
      });
  };

  const handleRemoveTask = (taskId) => {
    console.log(taskId);
    axios
      .delete(`http://localhost:3001/tasks/${taskId}`)
      .then((response) => {
        if (response.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
          );
          getTask();
        }
      })
      .catch((error) => {
        console.error("Error removing task:", error);
      });
  };

  const handleFilterCompleted = () => {
    setFilterCompleted(!filterCompleted);
  };

  const finalselected = () => {
      setShowNames(true);
      setShowDropdown(!showDropdown);
    
    // console.log(selectedMembers);
    // // setSelectedMembers("");
  };
  const filteredTasks = filterCompleted
    ? tasks.filter((task) => task.completed)
    : tasks;

  return (
    <>
      <UserHeader />
      <div className="manager-container">
        <h3 className="p-3 bg-light">Manager Dashboard</h3>
        <div className="manager-card">
          <div className="title">Ongoing Projects:</div>
          <hr />
          <div className="project-list">
            {tasks?.map((task) => (
              <Card>
                <Card.Header>{task.name}</Card.Header>
                <Card.Body>
                  <ListGroup.Item
                    key={task._id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex flex-column lh-lg">
                      <small>
                        <span>Assigned to: </span>{" "}
                        {task.assignedMembers.join(", ")}
                      </small>
                      <small>
                        <span>Deadline: </span>
                        {formatDate(task.deadline)}
                      </small>
                      <small>
                        <span>Priority: </span>
                        {task.priority}
                      </small>
                      <Badge
                        variant={task.completed ? "success" : "warning"}
                        className="d-flex align-items-center"
                        style={{
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {task.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                </Card.Body>
              </Card>
            ))}
          </div>
          <hr />
        </div>

        <div className="create-project">
          <h4>Create a new project</h4>
          <div className="project-desc">
            <div className="project-container">
              <Container fluid>
                <Form onSubmit={handleTaskSubmit}>
                  <Form.Group controlId="taskName">
                    <Form.Label>Task Name:</Form.Label>
                    <Form.Control
                      type="text"
                      value={newTask}
                      onChange={handleTaskChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="deadline">
                    <Form.Label>Deadline:</Form.Label>
                    <Form.Control
                      type="date"
                      value={newDeadline}
                      onChange={handleDeadlineChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="priority">
                    <Form.Label>Priority:</Form.Label>
                    <Form.Control
                      as="select"
                      value={newPriority}
                      onChange={handlePriorityChange}
                      required
                    >
                      <option value="">Select Priority</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </Form.Control>
                  </Form.Group>
                  <div>
                    <Button onClick={toggleDropdown}>Select Members</Button>
                    {showDropdown && (
                      <Dropdown.Menu
                        show={true}
                        className="p-2 , selectionlist"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Search members..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <Dropdown.Divider />
                        <ul className="list-unstyled">
                          {filteredMembers.map((member) => (
                            <li key={member.id}>
                              <Form.Check
                                type="checkbox"
                                label={member.name}
                                checked={selectedMembers.includes(member.name)}
                                onChange={() =>
                                  handleCheckboxChange(member.name)
                                }
                              />
                            </li>
                          ))}
                        </ul>
                        <Button onClick={finalselected}>Finalize</Button>
                      </Dropdown.Menu>
                    )}
                  </div>
                  {showNames && (
                    <div>
                      <h6>Selected Members:</h6>
                      <ul>
                        {selectedMembers.map((name) => (
                          <li>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Form.Group controlId="description">
                    <Form.Label>Notes:</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={newNote}
                      onChange={handleNoteChange}
                      rows={3}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Create Task
                  </Button>
                </Form>
              </Container>

              {/* Task List */}

              {/* Filter Completed Tasks */}
            </div>
          </div>
        </div>

        <div className="title mt-3">Edit task details: </div>
        <hr />
        <div className="filtered-container">
          <div className="mt-4 mb-4">
            <Form.Check
              type="switch"
              id="filterCompleted"
              label="Filter Completed Tasks"
              checked={filterCompleted}
              onChange={handleFilterCompleted}
            />
          </div>
          {filteredTasks.map((task) => (
            <div className=" filter-task" key={task._id}>
              <ListGroup.Item>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5>{task.name}</h5>
                    <p>
                      <strong>Deadline:</strong> {formatDate(task.deadline)}
                    </p>
                    <p>
                      <strong>Notes:</strong> {task.notes}
                    </p>
                    <p>
                      <strong>Assigned Team Member:</strong>{" "}
                      {task.assignedMembers.join(", ")}
                    </p>
                  </div>
                  <div className="buttons">
                    <Button
                      className="m-3"
                      variant={task.completed ? "success" : "secondary"}
                      onClick={() => handleCompleteTask(task._id)}
                    >
                      {task.completed ? "Reopen" : "Complete"}
                    </Button>
                    <Button
                      variant="info"
                      className="ml-2 m-3"
                      onClick={() => handleEditDeadline(task._id)}
                    >
                      Change Deadline
                    </Button>
                    <Button
                      variant="danger"
                      className="ml-2 m-3"
                      onClick={() => handleRemoveTask(task._id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {editDeadlineTaskId === task._id && (
                  <div className="mt-2">
                    <Form onSubmit={() => handleEditDeadlineSubmit(task._id)}>
                      <Form.Group controlId="editDeadline">
                        <Form.Control
                          type="date"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Save
                      </Button>
                    </Form>
                  </div>
                )}
              </ListGroup.Item>
            </div>
          ))}
        </div>
      </div>
      <Notification />
      <FileSharing />
    </>
  );
}

export default ManagerDashboard;
