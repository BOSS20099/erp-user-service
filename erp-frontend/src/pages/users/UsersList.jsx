import {useEffect,useState} from "react";
import {getUsers,deleteUser} from "../../services/userService";

export default function UsersList(){

const [users,setUsers]=useState([]);

useEffect(()=>{
load();
},[]);

const load=async()=>{
const res=await getUsers();
setUsers(res.data);
};

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-4">Users</h1>

<table className="w-full border">

<thead>
<tr className="bg-gray-200">
<th>ID</th>
<th>Username</th>
<th>Email</th>
</tr>
</thead>

<tbody>
{users.map(u=>(
<tr key={u.id}>
<td>{u.id}</td>
<td>{u.username}</td>
<td>{u.email}</td>
</tr>
))}
</tbody>

</table>

</div>

);
}
