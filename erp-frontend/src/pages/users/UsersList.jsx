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

useEffect(()=>{
  load();
},[]);

const load=async()=>{
  try {
    setLoading(true);
    const res=await getUsers();
    setUsers(res.data);
    
    const rolesMap = {};
    for (const user of res.data) {
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
      
      await load();
      
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

const filteredUsers = users.filter(u => 
  u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  u.email.toLowerCase().includes(searchTerm.toLowerCase())
);

const sortedUsers = [...filteredUsers].sort((a, b) => {
  if (sortBy === "id") return a.id - b.id;
  if (sortBy === "username") return a.username.localeCompare(b.username);
  if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
  return 0;
});

if (loading) return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
    <div className="text-center">
      <div className="loading-spinner mx-auto mb-4"></div>
      <p className="text-white text-xl">Chargement des utilisateurs...</p>
    </div>
  </div>
);

return(
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
    {/* Decorative elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-40 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 mb-2">
          👥 Gestion des Utilisateurs
        </h1>
        <p className="text-slate-400 text-lg">Gérez et administrez tous vos utilisateurs</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl animate-fade-in-up ${
          messageType === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
        }`}>
          {message}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="card p-6 mb-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">🔍 Rechercher</label>
            <input
              type="text"
              placeholder="Rechercher par nom d'utilisateur ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">📊 Trier par</label>
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
      <div className="mb-6 text-slate-300">
        <p className="font-semibold">📈 Total: <span className="text-cyan-400 font-black text-lg">{sortedUsers.length}</span> utilisateur(s)</p>
      </div>

      {/* Create Button */}
      <div className="mb-8">
        <Link to="/users/create" className="btn-success inline-flex items-center gap-2">
          ➕ Créer un nouvel utilisateur
        </Link>
      </div>

      {/* Users Grid */}
      {sortedUsers.length === 0 ? (
        <div className="card p-12 text-center animate-fade-in-up">
          <p className="text-5xl mb-4">😴</p>
          <p className="text-xl text-slate-600">Aucun utilisateur trouvé.</p>
          <p className="text-slate-500 mb-6">Créez votre premier utilisateur pour commencer.</p>
          <Link to="/users/create" className="btn-primary inline-block">
            ➕ Créer un utilisateur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedUsers.map((u, idx) => (
            <div
              key={u.id}
              className="card p-6 group hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-500 font-semibold">ID: {u.id}</div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {u.username}
                  </h3>
                </div>
                <div className="text-3xl">👤</div>
              </div>

              {/* User Info */}
              <div className="space-y-3 mb-4 border-t border-b border-slate-200 py-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Email</p>
                  <p className="text-slate-700 break-all">{u.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Membre depuis</p>
                  <p className="text-slate-700 font-semibold">{formatDate(u.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Statut</p>
                  {u.enabled ? (
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold">
                      ✓ Actif
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-bold">
                      ✕ Inactif
                    </span>
                  )}
                </div>
              </div>

              {/* Roles */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 font-semibold uppercase mb-2">Rôles</p>
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
                    <span className="text-slate-400 text-xs italic">Aucun rôle assigné</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
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
      )}
    </div>
  </div>
);
}
