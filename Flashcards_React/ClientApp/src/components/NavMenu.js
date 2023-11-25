import React, { useContext, useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import './NavMenu.css';
import AuthContext from '../context/AuthProvider'; // Adjust the path accordingly

const NavMenu = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    setAuth({isLoggedIn : false});
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Navigate to the default (in our case Home) component after logout
    navigate('/');
  };

 /* const renderAuthenticatedLinks = () => (
    <>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to="/browsedecks">Decks</NavLink>
      </NavItem>
      <NavItem>
        <NavLink className="text-dark" onClick={handleLogout}>Logout</NavLink>
      </NavItem>
    </>
  );*/

  return (
      <header>
          <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-dark">
              <NavbarBrand tag={Link} to="/">
                  <img src="catIcon.svg" alt="Flashcards Logo" width="20" height="20" />
                  Flashcards
              </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
              <Collapse isOpen={!collapsed} navbar>
                  <ul className="navbar-nav flex-grow">
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                      </NavItem>
                      {auth.isLoggedIn ? (
                      <>
                          <NavItem>
                              <NavLink tag={Link} className="text-light" to="/browsedecks">Decks</NavLink>
                          </NavItem>
                          <NavItem>
                              <NavLink className="text-light" onClick={handleLogout}>Logout</NavLink>
                          </NavItem>
                      </>) : (
              <>
                <NavItem>
                  <NavLink tag={Link} className="text-light" to="/register">Register</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-light" to="/login">Login</NavLink>
                </NavItem>
              </>
            )}
          </ul>
        </Collapse>
      </Navbar>
    </header>
  );
};

export default NavMenu;
