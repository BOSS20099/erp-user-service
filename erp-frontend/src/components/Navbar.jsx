import {Link} from "react-router-dom";
import { useState } from "react";

export default function Navbar(){
  const [isHovering, setIsHovering] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white p-6 shadow-2xl border-b-4 border-gradient-to-r from-blue-500 to-purple-500 sticky top-0 z-50">
      <div className="flex justify-between items-center px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-3xl font-black tracking-wider">
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-400 transition-all duration-300"
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
              className="nav-link hover:text-cyan-300"
            >
              🏠 Accueil
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              className="nav-link hover:text-blue-300"
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
