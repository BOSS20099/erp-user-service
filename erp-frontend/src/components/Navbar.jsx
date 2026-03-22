import {Link} from "react-router-dom";
import { useState } from "react";

export default function Navbar(){
  const [isHovering, setIsHovering] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-rose-200 via-pink-200 to-rose-200 text-rose-900 p-6 shadow-2xl border-b-4 border-gradient-to-r from-rose-400 to-pink-400 sticky top-0 z-50">
      <div className="flex justify-between items-center px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-3xl font-black tracking-wider">
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 transition-all duration-300"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <span className="text-4xl">{isHovering ? '🚀' : '👥'}</span>
            ERP Users
          </Link>
        </h1>
        
        {/* Navigation Links */}
        <ul className="flex gap-8 items-center">
          <li>
            <Link 
              to="/" 
              className="nav-link hover:text-rose-600"
            >
              🏠 Accueil
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              className="nav-link hover:text-rose-600"
            >
              👥 Utilisateurs
            </Link>
          </li>
          <li>
            <Link 
              to="/users/create" 
              className="btn-primary"
            >
              ➕ Nouvel utilisateur
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
