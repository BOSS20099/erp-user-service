import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">ERP System</h1>
        <ul className="flex gap-4">
          <li><a href="/" className="hover:text-gray-200">Home</a></li>
          <li><a href="/users" className="hover:text-gray-200">Users</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
