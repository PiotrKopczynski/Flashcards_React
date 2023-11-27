import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './adminStyles.css';


const FlashcardsUsersTable = () => {
    const [users, setUsers] = useState();
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const getUsers = async () => {
        if (auth.userRole != "admin") {
            navigate('/unauthorized')
        }
        try {
            const response = await api.get(`api/Admin/GetUsers`);

            if (response.status === 403) { // Unauthorized
                navigate('/unauthorized')
            }
            if (response.status === 200) {
                setUsers(response.data);
                setLoading(false);
            }
        }
        catch (e) {
            console.error("Error fetching decks:", e);
            if (e.isTokenRefreshError) { // The refresh of the JWT token failed or the tokens were invalid.
                // Navigate users with a invalid token pair out of the authenticated content
                setAuth({ isLoggedIn: false })
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                navigate('/login');
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!auth.isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        }
        getUsers();
    }, []);

    return (
        <>
            <h1 className="fs-3 text-center mb-5">Table of Flashcards Users</h1><div className="admin-page">
            {loading ? (<p> Loading...</p>) : (
                    <>
                    <div className="section-intro">
                            <table className='table table-striped'>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>NickName</th>
                                        <th>UserName</th>
                                        <th>NormalizedUserName</th>
                                        <th>Email</th>
                                        <th>NormalizedEmail</th>
                                        <th>EmailConfirmed</th>
                                        <th>PasswordHash</th>
                                        <th>SecurityStamp</th>
                                        <th>ConcurrencyStamp</th>
                                        <th>PhoneNumber</th>
                                        <th>PhoneNumberConfirmed</th>
                                        <th>TwoFactorEnabled</th>
                                        <th>LockoutEnd</th>
                                        <th>LockoutEnabled</th>
                                        <th>AccessFailCount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.userName}</td>
                                            <td>{user.normalizedUserName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.normalizedEmail}</td>
                                            <td>{user.emailConfirmed}</td>
                                            <td>{user.passwordHash}</td>
                                            <td>{user.securityStamp}</td>
                                            <td>{user.concurrencyStamp}</td>
                                            <td>{user.phoneNumber}</td>
                                            <td>{user.phoneNumberConfirmed}</td>
                                            <td>{user.twoFactorEnabled}</td>
                                            <td>{user.lockoutEnd}</td>
                                            <td>{user.lockoutEnabled}</td>
                                            <td>{user.accessFailedCount}</td>
                                            {/* Add CRUD operations if needed */}
                                            {/*
                    <td>
                        <button onClick={() => handleUpdate(user.Id)}>Update</button>
                        <button onClick={() => handleDelete(user.Id)}>Delete</button>
                    </td>
                    */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    </div>
                </>
            )}
        </div></>
    );
};

export default FlashcardsUsersTable;
