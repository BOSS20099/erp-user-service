import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, assignRoles, getUserRoles } from "../../services/userService";
import axios from "axios";

export default function RoleAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load user info
      const userRes = await getUser(id);
      setUser(userRes.data);

      // Load all available roles
      const rolesRes = await axios.get("http://localhost:8080/api/roles");
      setAllRoles(rolesRes.data);

      // Load user's current roles
      const userRolesRes = await getUserRoles(id);
      setSelectedRoles(userRolesRes.data.map((r) => r.id));

      setError("");
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await assignRoles(id, { roleIds: selectedRoles });
      alert("Rôles attribués avec succès !");
      navigate("/users");
    } catch (err) {
      console.error("Error assigning roles:", err);
      setError(err.response?.data?.message || "Erreur lors de l'attribution des rôles");
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Attribuer des rôles à {user?.username}</h1>

      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Rôles disponibles :</h2>
          <div className="space-y-2">
            {allRoles.map((role) => (
              <label key={role.id} className="flex items-center border p-3 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleRoleToggle(role.id)}
                  className="w-4 h-4 mr-3"
                />
                <div>
                  <p className="font-medium">{role.name}</p>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enregistrer les rôles
          </button>
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
