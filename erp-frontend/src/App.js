import {BrowserRouter,Routes,Route} from "react-router-dom";

import UsersList from "./pages/users/UsersList";
import CreateUser from "./pages/users/CreateUser";

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/users" element={<UsersList/>}/>
<Route path="/users/create" element={<CreateUser/>}/>

</Routes>

</BrowserRouter>

);

}

export default App;
