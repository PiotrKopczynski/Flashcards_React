import React, { useContext } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';

const Logout = () => {
  const { setAuth } = useContext(AuthContext);

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuth({isLoggedIn : false});
  }

  return (
    <Button variant="secondary" onClick={handleLogoutClick} as={Link} to="/">Logout</Button>
  );
};

export default Logout;