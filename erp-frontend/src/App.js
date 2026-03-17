import {BrowserRouter,Routes,Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UsersList from "./pages/users/UsersList";
import CreateUser from "./pages/users/CreateUser";
import EditUser from "./pages/users/EditUser";

function App(){
  return(
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar/>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/users" element={<UsersList/>}/>
            <Route path="/users/create" element={<CreateUser/>}/>
            <Route path="/users/:id" element={<EditUser/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
