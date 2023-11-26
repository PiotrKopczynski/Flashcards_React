import React from 'react';

const FlashcardsUsersTable = ({ users }) => {
    return (
        <div className="admin-page">
            <h1 className="fs-3 text-center mb-5">Table of Flashcards Users</h1>
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
                        <tr key={user.Id}>
                            <td>{user.Id}</td>
                            <td>{user.NickName}</td>
                            <td>{user.UserName}</td>
                            <td>{user.NormalizedUserName}</td>
                            <td>{user.Email}</td>
                            <td>{user.NormalizedEmail}</td>
                            <td>{user.EmailConfirmed}</td>
                            <td>{user.PasswordHash}</td>
                            <td>{user.SecurityStamp}</td>
                            <td>{user.ConcurrencyStamp}</td>
                            <td>{user.PhoneNumber}</td>
                            <td>{user.PhoneNumberConfirmed}</td>
                            <td>{user.TwoFactorEnabled}</td>
                            <td>{user.LockoutEnd}</td>
                            <td>{user.LockoutEnabled}</td>
                            <td>{user.AccessFailedCount}</td>
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
            {/* CRUD buttons or components here if needed */}
        </div>
    );
};

export default FlashcardsUsersTable;
