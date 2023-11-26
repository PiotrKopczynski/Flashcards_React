import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import WaveAnimation from './WaveAnimation';
import Footer from './Footer';

const Layout = ({ children }) => (
    <>
        <NavMenu />
        <WaveAnimation />
            <Container tag="main" className="pb-5">
                {children}
            </Container>   
        <Footer />
    </>

);

export default Layout;