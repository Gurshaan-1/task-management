import {React,useState,useEffect} from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import pic from '../../assets/task.png'
import { useNavigate } from 'react-router-dom';

function UserHeader() {
  const [username, setUsername] = useState("");
  const params = new URLSearchParams(window.location.search);
  const usernameParam = params.get('name');
  
  useEffect(() => {
  if(usernameParam){
    setUsername(usernameParam);
  }},[usernameParam]);

  const navigate = useNavigate();
  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand className="user-header">
        <Image src={pic} roundedCircle width={50} height={50} className="mr-2" onClick={() => navigate("/")} />
        {username}
      </Navbar.Brand>
      <Nav className='user-navbar'>
        
       
        <Nav.Link className="text-danger" onClick={handleSignOut}>
          <FaSignOutAlt />
          <span className='user-navbar'>Sign out</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default UserHeader