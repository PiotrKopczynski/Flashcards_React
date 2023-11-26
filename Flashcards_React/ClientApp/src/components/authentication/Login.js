import { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css'
import AuthContext from '../../context/AuthProvider';

const Login = () => {
    const {setAuth} = useContext(AuthContext);
    const emailRef = useRef(); // References for accesibility. Useful for screen readers.
    const errRef = useRef(); // References for accesibility. Useful for screen readers.
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch('/api/Authentication/Login', {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"Email": email, "Password": pwd })
            }
            );
            if (response.ok) {
                const data = await response.json();
                if (data.result === true) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    setAuth({ isLoggedIn: true, userRole: data.userRole });
                    setEmail('');
                    setPwd('');
                    navigate('/');
                }
                else {
                    setErrMsg("Login failed");
                    return;
                }  
            }
            if (response.status === 400) {
                const data = await response.json();
                setErrMsg(data.errors);
                return;
            }
        }
        catch (e) {
            console.log(e);
            if (!e?.response) {
                setErrMsg('No Server Response')
            }
            else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus();
        }
    }


    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    ref={emailRef}
                    autoComplete="on"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/Register">Sign Up</Link>
                </span>
            </p>
        </section>
    );
};

export default Login;