import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import WaveAnimation from './WaveAnimation';

const Layout = ({ children }) => (
    <div>
        <NavMenu />
        <WaveAnimation />
        <Container tag="main">
            {children}
        </Container>
    </div>
);

export default Layout;