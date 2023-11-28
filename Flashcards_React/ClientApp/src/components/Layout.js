import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import WaveAnimation from './WaveAnimation';
import Footer from './Footer';

const Layout = ({ children }) => (
    <div className="layout-container">
        <NavMenu />
        <WaveAnimation />
        <div className="main-content">
            <Container tag="main" className="pb-5">
                {children}
            </Container>  
        </div>   
        <Footer />
    </div>

);

export default Layout;