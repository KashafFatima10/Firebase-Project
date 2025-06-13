// export default MyNavbar;
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { useFirebase } from "../context/Firebase";
import { useNavigate } from "react-router-dom";

const MyNavbar = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await firebase.signoutUser();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Navbar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/book/list">Add Listing</Nav.Link>
          <Nav.Link href="/book/orders">Orders</Nav.Link>
        </Nav>

        {/* Right Side Buttons */}
        {firebase.isLoggedIn ? (
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <div className="d-flex align-items-center gap-2">
            {/* d-flex and gap-2 class for spacing */}
            <Nav.Link href="/login" className="text-light">
              Login here
            </Nav.Link>
            <Nav.Link href="/register" className="text-light">
              Register here
            </Nav.Link>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default MyNavbar;  

