import React, { useEffect, useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import { delUserById, getUserData } from "../../../apis/api";
import AdminNav from "../../../components/AdminNav";
import FooterCard from "../../../components/FooterCard";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserData();
        setUsers(response.data.data || []);
      } catch (error) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await delUserById(userId);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        setError("Failed to delete user");
      }
    }
  };

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <div
        className='container-fluid'
        style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
      >
        <div className='row'>
          <AdminNav />
          <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
            <h2 className='my-4' style={{ color: "black" }}>
              User Management
            </h2>

            {loading ? (
              <Spinner animation='border' variant='primary' />
            ) : error ? (
              <Alert variant='danger'>{error}</Alert>
            ) : (
              <div className='table-responsive'>
                <Table
                  bordered
                  hover
                  className='bg-white'
                  style={{ backgroundColor: "#D8CEC4" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{ backgroundColor: "black", color: "#FFFFFF" }}
                      >
                        Username
                      </th>
                      <th
                        style={{ backgroundColor: "black", color: "#FFFFFF" }}
                      >
                        Email
                      </th>
                      <th
                        style={{ backgroundColor: "black", color: "#FFFFFF" }}
                      >
                        Phone Number
                      </th>
                      <th
                        style={{ backgroundColor: "black", color: "#FFFFFF" }}
                      >
                        Age
                      </th>
                      <th
                        style={{ backgroundColor: "black", color: "#FFFFFF" }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.fullname}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                          <td>{user.age}</td>
                          <td>
                            <Button
                              variant='danger'
                              onClick={() => handleDelete(user._id)}
                              style={{
                                backgroundColor: "black",
                                borderColor: "black",
                              }}
                            >
                              Delete User
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan='5'>No users found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}

            {/* Edit User Modal */}
          </main>
        </div>
      </div>
      <FooterCard />
    </>
  );
};

export default ViewUsers;
