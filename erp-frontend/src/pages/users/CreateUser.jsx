import {useEffect, useState} from "react";
import {createUser, assignRoles} from "../../services/userService";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function CreateUser(){

const [user,setUser]=useState({username:"",email:"",password:"",profilePhoto:null});
const [roles, setRoles] = useState([]);
const [selectedRoles, setSelectedRoles] = useState([]);
const [error,setError]=useState("");
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [photoPreview, setPhotoPreview] = useState(null);
const navigate=useNavigate();

const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Create a base64 preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setUser(prevUser => ({...prevUser, profilePhoto: reader.result}));
    };
    reader.readAsDataURL(file);
  }
};

const removePhoto = () => {
  setPhotoPreview(null);
  setUser(prevUser => ({...prevUser, profilePhoto: null}));
};

useEffect(() => {
  loadRoles();
}, []);

const loadRoles = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/roles");
    setRoles(res.data);
  } catch (err) {
    console.error("Error loading roles:", err);
  } finally {
    setLoading(false);
  }
};

const handleRoleChange = (roleId) => {
  if (selectedRoles.includes(roleId)) {
    setSelectedRoles(selectedRoles.filter(r => r !== roleId));
  } else {
    setSelectedRoles([...selectedRoles, roleId]);
  }
};

const submit=async(e)=>{
  e.preventDefault();
  setError("");
  setSubmitting(true);
  try{
    const res=await createUser(user);
    const newUserId = res.data.id;
    
    if (selectedRoles.length > 0) {
      await assignRoles(newUserId, { roleIds: selectedRoles });
    }
    
    console.log("User created with roles:",res);
    setUser({username:"",email:"",password:""});
    setSelectedRoles([]);
    navigate("/users");
  }catch(err){
    console.error("Error:",err);
    setError(err.response?.data?.message || err.message || "Erreur lors de la création de l'utilisateur");
  } finally {
    setSubmitting(false);
  }
};

if (loading) return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
    <div className="text-center">
      <div className="loading-spinner mx-auto mb-4"></div>
      <p className="text-rose-700 text-xl">Chargement des rôles...</p>
    </div>
  </div>
);

return(
  <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-8">
    {/* Decorative elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-40 right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
    </div>

    <div className="relative z-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-600 mb-2">
          ➕ Créer un nouvel utilisateur
        </h1>
        <p className="text-rose-600 text-lg">Remplissez les détails ci-dessous pour ajouter un nouvel utilisateur</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl animate-fade-in-up bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg font-semibold">
          ❌ {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={submit} className="card p-8 animate-fade-in-up space-y-6">
        
        {/* Profile Photo Section */}
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-6">
            📷 Photo de profil
          </h2>
          
          <div className="flex flex-col items-center">
            <label className="cursor-pointer">
              <div className="w-32 h-32 rounded-full border-4 border-rose-200 overflow-hidden flex items-center justify-center bg-rose-50 hover:border-rose-400 transition-all duration-300">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-rose-400">
                    <svg className="w-12 h-12 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">Cliquez</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            {photoPreview && (
              <button 
                type="button"
                onClick={removePhoto}
                className="mt-2 text-sm text-rose-500 hover:text-rose-700 underline"
              >
                Supprimer la photo
              </button>
            )}
            <p className="text-xs text-rose-400 mt-2">Cliquez sur la photo pour télécharger</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-slate-200"></div>
        
        {/* User Information Section */}
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-6">
            👤 Informations de l'utilisateur
          </h2>

          {/* Username Field */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-rose-700 mb-2">
              👤 Nom d'utilisateur
            </label>
            <input
              type="text"
              placeholder="Entrez le nom d'utilisateur"
              value={user.username}
              onChange={e=>setUser({...user,username:e.target.value})}
              className="input-field"
              required
              disabled={submitting}
            />
          </div>

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-rose-700 mb-2">
              📧 Email
            </label>
            <input
              type="email"
              placeholder="Entrez l'adresse email"
              value={user.email}
              onChange={e=>setUser({...user,email:e.target.value})}
              className="input-field"
              required
              disabled={submitting}
            />
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-rose-700 mb-2">
              🔒 Mot de passe
            </label>
            <input
              type="password"
              placeholder="Entrez un mot de passe sécurisé"
              value={user.password}
              onChange={e=>setUser({...user,password:e.target.value})}
              className="input-field"
              required
              disabled={submitting}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-slate-200"></div>

        {/* Roles Section */}
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-6">
            🎯 Sélectionnez les rôles
          </h2>
          <p className="text-rose-600 text-sm mb-4">Assignez un ou plusieurs rôles à cet utilisateur</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role, idx) => (
              <label 
                key={role.id} 
                className={`card p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedRoles.includes(role.id) 
                    ? 'ring-2 ring-rose-400 bg-rose-50' 
                    : 'hover:shadow-lg'
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleRoleChange(role.id)}
                        className="w-5 h-5 accent-rose-500 cursor-pointer"
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-rose-900">{role.name}</p>
                      <p className="text-xs text-rose-700 mt-1">{role.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {selectedRoles.length > 0 && (
            <div className="mt-4 p-4 bg-rose-50 rounded-lg border-l-4 border-rose-500">
              <p className="text-sm text-rose-900 font-semibold">
                ✓ {selectedRoles.length} rôle(s) sélectionné(s)
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-slate-200"></div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit"
            disabled={submitting}
            className="flex-1 btn-success font-bold text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="loading-spinner mx-0"></span>
                Création en cours...
              </>
            ) : (
              <>
                ✓ Créer l'utilisateur
              </>
            )}
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/users")}
            disabled={submitting}
            className="flex-1 btn-primary font-bold text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
