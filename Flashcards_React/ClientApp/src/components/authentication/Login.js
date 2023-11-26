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
                    setAuth({ isLoggedIn: true });
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
            <div className="row justify-content-center">
                <div className="col-xl-5 col-lg-6 col-md-7 col-sm-8 col-10 mt-2">
                    <div className="form-container">
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1 className="fs-2 text-center">Sign In</h1>
                        <hr />
                        <form onSubmit={handleSubmit}>
                            {/*<label htmlFor="email">Email:</label>*/}
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    id="email"
                                    ref={emailRef}
                                    autoComplete="on"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />   
                            </div>
                            <div className="form-floating mb-3">
                                {/*<label htmlFor="password">Password:</label>*/}
                                <input
                                    type="password"
                                    placeholder="Password"
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                />
                            </div>
                            <div>
                                <button className="w-100 btn btn-lg btn-primary mb-3">Sign In</button>
                            </div>
                        </form>
                        <div>
                            <p className="fs-5 text-center">
                            Need an Account?<br />
                                <span className="line">
                                    <Link to="/Register" id="form-text">Sign Up</Link>
                            </span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
         </div>
    );
};

export default Login;