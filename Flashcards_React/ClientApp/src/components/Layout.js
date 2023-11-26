import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import WaveAnimation from './WaveAnimation';
import Footer from './Footer';

const Layout = ({ children }) => (
    <div className="main-content">
        <NavMenu />
        <div className="">
            <WaveAnimation />
            <Container tag="main" className="pb-5">
                {children}
            </Container>   
        </div>
        <Footer />
    </div>
);

export default Layout;