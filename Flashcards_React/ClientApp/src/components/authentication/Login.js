import { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
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
        <div className="login-form-section">
            <div className="row">
                <div className="col-xl-5 col-lg-6 col-md-7 col-sm-8 col-10 mt-2">
                    <div className="card login-card mx-3">
                        <div className="card-body">
                            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                            <h1 className="fs-2 text-center">Welcome back!</h1>
                            <hr className="custom-hr" />
                            <form onSubmit={handleSubmit}> 
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Email"
                                        id="email"
                                        ref={emailRef}
                                        autoComplete="on"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        required
                                    /> 
                                    <label htmlFor="email">Email</label>
                                </div>
                                <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            id="password"
                                            onChange={(e) => setPwd(e.target.value)}
                                            value={pwd}
                                            required
                                        />
                                        <label htmlFor="password">Password</label>
                                </div>
                                <div className="text-center">
                                    <button className="w-100 btn btn-lg btn-primary mb-3">Sign In</button>
                                    <p className="fs-5"> Need an Account?</p>
                                    <span><Link to="/Register">Sign Up</Link></span>
                                </div>
                            </form>     
                        </div>
                    </div>
                </div>
            </div>
        </div>
         
    );
};

export default Login;