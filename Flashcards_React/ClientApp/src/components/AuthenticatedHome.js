import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SleepyCatAnimation from './SleepyCatAnimation';
import BulbAnimation from './BulbAnimation';
import './AuthenticatedHome.css';

  
const AuthenticatedHome = () => {

    useEffect(() => {
        document.body.style.backgroundColor = '#192040';

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div>
            <h1 className=" text-center mb-0 fs-1 heading">Ready to practice?</h1>
            <div className="cat-wakeup">
                <BulbAnimation></BulbAnimation>
                <SleepyCatAnimation></SleepyCatAnimation>
            </div>
            <div className="practice-btn">
                <Link to="/BrowseDecks" id="sleepy-cat-btn" className="btn btn-primary me-3">Let's go!</Link>
            </div>
        </div >
);
};
  
  export default AuthenticatedHome;