import React, { useState, useEffect } from "react";
import "../../css/AdminManagement.css";

import { fetchAllUsers, changeRole } from "./HandleAPI_Admin";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsersData = await fetchAllUsers();
        setUsers(allUsersData);
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const changeRoles = await changeRole(userId, newRole);
      if (changeRoles.payload) {
        const allUsersData = await fetchAllUsers();
        setUsers(allUsersData);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (!users) {
    return;
  }

  return (
    <div className="container-fluid container-admin">
      <h2>Kelola Pengguna</h2>
      <div className="table-responsive">
        <table className="table table-admin">
          <thead className="thead-light">
            <tr>
              <th>Id User</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Edit Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_user}>
                <td>{user.id_user}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    className="form-select"
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id_user, e.target.value)
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
