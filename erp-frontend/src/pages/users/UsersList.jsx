import {useEffect,useState} from "react";
import {getUsers,deleteUser,getUserRoles} from "../../services/userService";
import {Link} from "react-router-dom";

export default function UsersList(){

const [users,setUsers]=useState([]);
const [userRoles, setUserRoles] = useState({});
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [sortBy, setSortBy] = useState("id");

// Pagination state
const [currentPage, setCurrentPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);
const [totalElements, setTotalElements] = useState(0);
const pageSize = 9;

useEffect(()=>{
  load(currentPage);
},[currentPage, sortBy]);

useEffect(() => {
  // Debounce search
  const timer = setTimeout(() => {
    setCurrentPage(0);
    load(0);
  }, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);

const load=async(page=0)=>{
  try {
    setLoading(true);
    const res=await getUsers(page, pageSize, sortBy, searchTerm);
    setUsers(res.data.content);
    setTotalPages(res.data.totalPages);
    setTotalElements(res.data.totalElements);
    
    const rolesMap = {};
    for (const user of res.data.content) {
      try {
        const rolesRes = await getUserRoles(user.id);
        rolesMap[user.id] = rolesRes.data || [];
      } catch (err) {
        rolesMap[user.id] = [];
      }
    }
    setUserRoles(rolesMap);
  } catch (err) {
    console.error("Error loading users:", err);
  } finally {
    setLoading(false);
  }
};

const handleDelete=async(id)=>{
  if(window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")){
    try {
      setLoading(true);
      await deleteUser(id);
      
      setMessage("✅ Utilisateur supprimé avec succès !");
      setMessageType("success");
      
      await load(currentPage);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting user:", err);
      setMessage("❌ Erreur lors de la suppression de l'utilisateur");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      setLoading(false);
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getRoleColor = (roleName) => {
  const colors = {
    'ADMIN': 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    'MANAGER': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    'VENTES': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    'GESTIONNAIRE_ACHATS': 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
    'GESTIONNAIRE_STOCK': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    'COMPTABLE': 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white',
    'GESTIONNAIRE_RH': 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
  };
  return colors[roleName] || 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
};

const handlePageChange = (newPage) => {
  if (newPage >= 0 && newPage < totalPages) {
    setCurrentPage(newPage);
  }
};

const getPageNumbers = () => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible);
  
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }
  
  for (let i = start; i < end; i++) {
    pages.push(i);
  }
  return pages;
};

if (loading && users.length === 0) return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
    <div className="text-center">
      <div className="loading-spinner mx-auto mb-4"></div>
      <p className="text-rose-700 text-xl">Chargement des utilisateurs...</p>
    </div>
  </div>
);

return(
  <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-8">
    {/* Decorative elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-40 left-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-40 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-600 mb-2">
          👥 Gestion des Utilisateurs
        </h1>
        <p className="text-rose-600 text-lg">Gérez et administrez tous vos utilisateurs</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl animate-fade-in-up ${
          messageType === 'success' 
            ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg' 
            : 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg'
        }`}>
          {message}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="card p-6 mb-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-rose-700 mb-2">🔍 Rechercher</label>
            <input
              type="text"
              placeholder="Rechercher par nom d'utilisateur ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-rose-700 mb-2">📊 Trier par</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="id">ID (croissant)</option>
              <option value="username">Nom d'utilisateur</option>
              <option value="date">Date (récent)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Count */}
      <div className="mb-6 text-rose-600">
        <p className="font-semibold">📈 Total: <span className="text-rose-500 font-black text-lg">{totalElements}</span> utilisateur(s)</p>
      </div>

      {/* Create Button */}
      <div className="mb-8">
        <Link to="/users/create" className="btn-success inline-flex items-center gap-2">
          ➕ Créer un nouvel utilisateur
        </Link>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in-up">
          <p className="text-5xl mb-4">😴</p>
          <p className="text-xl text-rose-700">Aucun utilisateur trouvé.</p>
          <p className="text-rose-600 mb-6">Créez votre premier utilisateur pour commencer.</p>
          <Link to="/users/create" className="btn-primary inline-block">
            ➕ Créer un utilisateur
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {users.map((u, idx) => (
              <div
                key={u.id}
                className="card p-6 group hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* User Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {u.profilePhoto ? (
                      <img 
                        src={u.profilePhoto} 
                        alt={u.username} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-rose-300"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-rose-600 font-semibold">ID: {u.id}</div>
                      <h3 className="text-2xl font-black text-rose-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-pink-600 transition-all duration-300">
                        {u.username}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-3 mb-4 border-t border-b border-rose-200 py-4">
                  <div>
                    <p className="text-xs text-rose-600 font-semibold uppercase">Email</p>
                    <p className="text-rose-800 break-all">{u.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-rose-600 font-semibold uppercase">Membre depuis</p>
                    <p className="text-rose-800 font-semibold">{formatDate(u.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-rose-600 font-semibold uppercase mb-2">Statut</p>
                    {u.enabled ? (
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full text-xs font-bold">
                        ✓ Actif
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full text-xs font-bold">
                        ✕ Inactif
                      </span>
                    )}
                  </div>
                </div>

                {/* Roles */}
                <div className="mb-4">
                  <p className="text-xs text-rose-600 font-semibold uppercase mb-2">Rôles</p>
                  <div className="flex flex-wrap gap-2">
                    {userRoles[u.id] && userRoles[u.id].length > 0 ? (
                      userRoles[u.id].map(role => (
                        <span 
                          key={role.id} 
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getRoleColor(role.name)}`}
                        >
                          {role.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-rose-500 text-xs italic">Aucun rôle assigné</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-rose-200">
                  <Link 
                    to={`/users/${u.id}`} 
                    className="flex-1 btn-primary text-sm py-2 px-3 text-center"
                  >
                    ✏️ Modifier
                  </Link>
                  <button 
                    onClick={() => handleDelete(u.id)} 
                    className="flex-1 btn-danger text-sm py-2 px-3"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center">
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  }`}
                >
                  ««
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  }`}
                >
                  «
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg'
                        : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage >= totalPages - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  }`}
                >
                  »
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage >= totalPages - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  }`}
                >
                  »»
                </button>
              </div>

              {/* Page Info */}
              <p className="mt-4 text-rose-600 text-sm">
                Page <span className="font-bold">{currentPage + 1}</span> sur <span className="font-bold">{totalPages}</span>
                {' | '}
                Affichage de <span className="font-bold">{currentPage * pageSize + 1}</span> à <span className="font-bold">{Math.min((currentPage + 1) * pageSize, totalElements)}</span> sur <span className="font-bold">{totalElements}</span> utilisateurs
              </p>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
}
