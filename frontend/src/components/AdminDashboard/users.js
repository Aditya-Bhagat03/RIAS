import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/user.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [departmentFilterNotApproved, setDepartmentFilterNotApproved] =
    useState("");
  const [roleFilterNotApproved, setRoleFilterNotApproved] = useState("");
  const [departmentFilterApproved, setDepartmentFilterApproved] = useState("");
  const [roleFilterApproved, setRoleFilterApproved] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleApproveUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/faculty/approve-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isApproved: true } : user
        )
      );
    } catch (error) {
      setError("Error approving user.");
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await axios.post(
        `http://localhost:4000/api/faculty/reject-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isApproved: false } : user
        )
      );
    } catch (error) {
      setError("Error rejecting user.");
    }
  };

  const handleBulkApprove = async () => {
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          axios.post(
            `http://localhost:4000/api/faculty/approve-user/${userId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setUsers(
        users.map((user) =>
          selectedUsers.includes(user._id)
            ? { ...user, isApproved: true }
            : user
        )
      );
      setSelectedUsers([]);
    } catch (error) {
      setError("Error approving users.");
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevState) =>
      prevState.includes(userId)
        ? prevState.filter((id) => id !== userId)
        : [...prevState, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === notApprovedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(notApprovedUsers.map((user) => user._id));
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedUsers = filteredUsers.filter((user) => user.isApproved);
  const notApprovedUsers = filteredUsers.filter((user) => !user.isApproved);

  const filteredApprovedUsers = approvedUsers.filter(
    (user) =>
      (departmentFilterApproved === "" ||
        user.department === departmentFilterApproved) &&
      (roleFilterApproved === "" || user.role === roleFilterApproved)
  );

  const filteredNotApprovedUsers = notApprovedUsers.filter(
    (user) =>
      (departmentFilterNotApproved === "" ||
        user.department === departmentFilterNotApproved) &&
      (roleFilterNotApproved === "" || user.role === roleFilterNotApproved)
  );

  return (
    <div className="userdashboard-container">
      <input
        type="text"
        className="userdashboard-search-bar"
        placeholder="Search by username or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p>Loading...</p>}
      {error && <p className="userdashboard-error-message">{error}</p>}

      <div className="userdashboard-table-wrapper">
        <div className="userdashboard-not-approved-table-container userdashboard-table-container">
          <div className="userdashboard-header">
            <h3
              className="userdashboard-heading"
              style={{
                color: "white",
                fontSize: "24px",
                fontWeight: "bold",
                margin: "10px 0",
              }}
            >
              Not Approved Users
            </h3>

            <div className="userdashboard-filters"></div>
            <button
              className="userdashboard-select-all-button"
              onClick={handleSelectAll}
            >
              {selectedUsers.length === filteredNotApprovedUsers.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <table className="userdashboard-table userdashboard-not-approved-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Approved</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotApprovedUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isApproved ? "Yes" : "No"}</td>
                  <td>
                    {!user.isApproved && (
                      <button
                        className="userdashboard-approve-button"
                        onClick={() => handleApproveUser(user._id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="userdashboard-view-button"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="userdashboard-select-button"
            onClick={handleBulkApprove}
          >
            Approve Selected
          </button>
        </div>

        <div className="userdashboard-approved-table-container userdashboard-table-container">
          <h3
            className="userdashboard-heading"
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "10px 0",
            }}
          >
            Approved Users
          </h3>
          <div className="userdashboard-filters"></div>
          <table className="userdashboard-table userdashboard-approved-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Approved</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovedUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.isApproved ? "Yes" : "No"}</td>
                  <td>
                    {user.isApproved && (
                      <button
                        className="userdashboard-reject-button"
                        onClick={() => handleRejectUser(user._id)}
                      >
                        Unapprove
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="userdashboard-view-button"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isPopupOpen && selectedUser && (
        <div className="userdashboard-popup">
          <div className="userdashboard-popup-content">
            <h3>User Details</h3>
            <p>
              <strong>Username:</strong> {selectedUser.username}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p>
              <strong>Approved:</strong>{" "}
              {selectedUser.isApproved ? "Yes" : "No"}
            </p>
            <button
              className="userdashboard-popup-close-button"
              onClick={handleClosePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;