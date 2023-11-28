import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CatAnimation from './CatAnimation';
import './UnauthenticatedHome.css';

export class UnauthenticatedHome extends Component {

  render() {
    return (
        
            <section className="section-intro">
                <div className="blob-content mb-1">
                    <h1 className="text-center mb-4">Discover a free and fun path to effective learning!</h1>
                <div className="d-flex justify-content-center mt-4 mb-4">
                        <Link to="/register" className="btn btn-primary me-3">GET STARTED</Link>
                        <Link to="/login" className="btn btn-secondary">ALREADY HAVE AN ACCOUNT</Link>
                    </div>
                </div>
                <CatAnimation/>
            </section>
    );
  }
}

export default UnauthenticatedHome;
