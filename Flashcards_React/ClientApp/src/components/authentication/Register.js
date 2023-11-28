import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import './Register.css';

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [validUserName, setValidUserName] = useState(false);
    const [userNameFocus, setUserNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus(); // Set the focus on the email input field
    }, [])

    useEffect(() => { // Check the username
        setValidUserName(USERNAME_REGEX.test(userName));
    }, [userName])

    useEffect(() => { // Check the email
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => { // Check the password
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => { // useEffect for the error message
        setErrMsg('');
    }, [userName, email, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the input fields again in case the sign in button was wrongly enabled.
        const v1 = USERNAME_REGEX.test(userName);
        const v2 = EMAIL_REGEX.test(email);
        const v3 = PWD_REGEX.test(pwd);
        if (!v1 | !v2 | !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await fetch('/api/Authentication/Register', {
                method: 'Post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "UserName": userName, "Email": email, "Password": pwd })
                }
            );
            if (response.ok) {
                console.log(response.text());
                setSuccess(true);
                setUserName('');
                setEmail('');
                setPwd('');
                setMatchPwd('');
                navigate('/login');
            }
            else {
                setErrMsg("Registration failed");
                return;
            }       
        }
        catch (e) {
            console.log(e)
            if (!e?.response) {
                setErrMsg('No Server Response')
            }
            else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1 className="fs-2">Success!</h1>
                    <p>
                        <Link to="/login">Sign In</Link>
                    </p>
                </section>
            ) : (
                    <div className="register-form-section">
                        <div className="row">
                            <div className="col-xl-5 col-lg-6 col-md-7 col-sm-8 col-10 mt-2">
                                <div className="card login-card mx-3">
                                    <div className="card-body">
                                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                                        <h1 className="fs-2 text-center">Register</h1>
                                        <hr className="custom-hr" />

                                        <form onSubmit={handleSubmit}>

                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Username"
                                                    id="username"
                                                    ref={userRef} // Allows us to set focus on the input
                                                    autoComplete="off" // Autocomplete off for security
                                                    onChange={(e) => setUserName(e.target.value)} // Set the userName state.
                                                    value={userName}
                                                    required
                                                    aria-invalid={validUserName ? "false" : "true"} // Highlights the input form if the infromation needs to be changed before submitting.
                                                    aria-describedby="uidnote"
                                                    onFocus={() => setUserNameFocus(true)}
                                                    onBlur={() => setUserNameFocus(false)}
                                                />
                                                <label htmlFor="username">
                                                    Username
                                                    <FontAwesomeIcon icon={faCheck} className={validUserName ? "valid" : "hide"} />
                                                    <FontAwesomeIcon icon={faTimes} className={validUserName || !userName ? "hide" : "invalid"} />
                                                </label>

                                                <p id="uidnote" className={userNameFocus && userName && !validUserName ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    4 to 24 characters.<br />
                                                    Must begin with a letter.<br />
                                                    Letters, numbers, underscores, hyphens allowed.
                                                </p>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Email"
                                                    id="email"
                                                    autoComplete="on"
                                                    onChange={(e) => setEmail(e.target.value)} // Set the userName state.
                                                    required
                                                    aria-invalid={validEmail ? "false" : "true"} // Highlights the input form if the infromation needs to be changed before submitting.
                                                    aria-describedby="emailnote"
                                                    onFocus={() => setEmailFocus(true)}
                                                    onBlur={() => setEmailFocus(false)}
                                                />
                                                <label htmlFor="email">
                                                    Email
                                                    <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                                    <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                                                </label>
                                                <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    Must be a valid email.<br />
                                                    Must contain @ and . as separators.<br />
                                                    Letters, numbers, and special characters allowed.
                                                </p>
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
                                                    aria-invalid={validPwd ? "false" : "true"}
                                                    aria-describedby="pwdnote"
                                                    onFocus={() => setPwdFocus(true)}
                                                    onBlur={() => setPwdFocus(false)}
                                                />
                                                <label htmlFor="password">
                                                    Password
                                                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                                </label>
                                                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    8 to 24 characters.<br />
                                                    Must include uppercase and lowercase letters, a number and a special character.<br />
                                                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                                                </p>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    placeholder="Confirm Password"
                                                    id="confirm_pwd"
                                                    onChange={(e) => setMatchPwd(e.target.value)}
                                                    value={matchPwd}
                                                    required
                                                    aria-invalid={validMatch ? "false" : "true"}
                                                    aria-describedby="confirmnote"
                                                    onFocus={() => setMatchFocus(true)}
                                                    onBlur={() => setMatchFocus(false)}
                                                />
                                                <label htmlFor="confirm_pwd">
                                                    Confirm Password
                                                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                                </label>
                                                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                    Must match the first password input field.
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                {/* Disable the button unless all of the input fields are valid */}
                                                <button className="w-100 btn btn-lg btn-primary mb-3" disabled={!validUserName || !validEmail || !validPwd || !validMatch ? true : false}>Sign Up</button>
                                                <p className="fs-5"> Already registered?</p>
                                                <span><Link to="/login">Sign In</Link></span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            )}
        </>
    );
};

export default Register;