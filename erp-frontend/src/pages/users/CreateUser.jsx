import {useState} from "react";
import {createUser} from "../../services/userService";

export default function CreateUser(){

const [user,setUser]=useState({username:"",email:"",password:""});

const submit=async(e)=>{
e.preventDefault();
await createUser(user);
};

return(

<form onSubmit={submit} className="p-6">

<input
className="border p-2"
placeholder="username"
onChange={e=>setUser({...user,username:e.target.value})}
/>

<input
className="border p-2"
placeholder="email"
onChange={e=>setUser({...user,email:e.target.value})}
/>

<input
className="border p-2"
type="password"
placeholder="password"
onChange={e=>setUser({...user,password:e.target.value})}
/>

<button className="bg-blue-500 text-white p-2">
Create
</button>

</form>

);
}
