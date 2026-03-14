import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { updateUser, getUsers } from "../../services/userService";

const EditUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setFetching(true);
      const response = await getUsers();
      const user = response.data.find(u => u.id === parseInt(id));
      if (user) {
        setFormData(user);
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("Failed to fetch user");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateUser(id, formData);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/users";
      }, 1500);
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-3xl font-bold mb-4">Edit User</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">User updated successfully!</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-400 p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">Role:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-gray-400 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
