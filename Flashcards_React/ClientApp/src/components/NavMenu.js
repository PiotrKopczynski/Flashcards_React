import React, { useContext, useState } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import './NavMenu.css';
import AuthContext from '../context/AuthProvider';

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


  return (
      <header>
          <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-dark fs-5">
              <NavbarBrand tag={Link} to="/">
                  <img src="catIcon.svg" alt="Flashcards Logo" width="25" height="25" className="icon-spacing" />
                  Flashcards
              </NavbarBrand>
              <NavbarToggler onClick={toggleNavbar} className="mr-2" />
              <Collapse isOpen={!collapsed} navbar>
                  <ul className="navbar-nav flex-grow">
                      {auth.isLoggedIn ? (
                      <>
                          <NavItem>
                              <NavLink tag={Link} className="text-light" to="/browsedecks">Decks</NavLink>
                          </NavItem>
                          {auth.userRole === "admin" && (
                              <NavItem>
                                  <NavLink tag={Link} className="text-light" to="/usertable">UserTable</NavLink>
                              </NavItem>
                          )}
                          <NavItem>
                                  <NavLink className="text-light" style={{cursor: 'pointer'}} onClick={handleLogout}>Logout</NavLink>
                          </NavItem>
                      </>) : (
                              <>
                                  <NavItem>
                                      <NavLink tag={Link} className="text-light" to="/register">Register</NavLink>
                                  </NavItem>
                                  <NavItem>
                                      <NavLink tag={Link} className="text-light" to="/login">Login</NavLink>
                                  </NavItem>
                              </>)}
                  </ul>
                  </Collapse>
          </Navbar>
    </header>
  );
};

export default NavMenu;
