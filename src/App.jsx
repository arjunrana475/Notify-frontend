import { Route, Routes } from "react-router-dom";
import  Login from "./pages/Login.jsx";
import  Register from "./pages/Register.jsx";
import Home from "./pages/Home";
import CreateNote from "./pages/CreateNote.jsx";
import NoteDetails from "./pages/NoteDetails.jsx";
import EditNote from "./pages/EditNote.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pinned from "./pages/Pinned.jsx";
import Archive from "./pages/Archive.jsx";
import Category from "./pages/Category";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/createNote" element={<CreateNote />} />
        <Route path="/note/:id" element={<NoteDetails />} />
        <Route path="/edit-note/:id" element={<EditNote />} />
        <Route path="/get_all_pinned_notes" element={<Pinned />} />
        <Route path="/get_all_archived_notes" element={<Archive />} />
        <Route path="/category/:category" element={<Category />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
}

export default App;