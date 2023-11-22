/*import React, { Component } from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NavMenu />
        <Container tag="main">
          {this.props.children}
        </Container>
      </div>
    );
  }
}*/
import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

const Layout = ({ children }) => (
  <div>
    <NavMenu />
    <Container tag="main">
      {children}
    </Container>
  </div>
);

export default Layout;