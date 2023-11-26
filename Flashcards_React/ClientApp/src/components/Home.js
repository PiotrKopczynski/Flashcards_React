import {useContext} from 'react';
import UnauthenticatedHome from './UnauthenticatedHome';
import AuthenticatedHome from './AuthenticatedHome';
import AuthContext from '../context/AuthProvider';

const Home = () => {
    const {auth} = useContext(AuthContext);
    return (
        <div>
            {auth.isLoggedIn ? <AuthenticatedHome /> : <UnauthenticatedHome/>}
        </div>
    );
};

export default Home;