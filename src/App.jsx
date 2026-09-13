import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./context/ThemeContext";
import Loader from "./components/Loader";

// Lazy-loaded route components for optimal initial loading performance & code splitting
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const CreateNote = lazy(() => import("./pages/CreateNote.jsx"));
const NoteDetails = lazy(() => import("./pages/NoteDetails.jsx"));
const EditNote = lazy(() => import("./pages/EditNote.jsx"));
const Pinned = lazy(() => import("./pages/Pinned.jsx"));
const Archive = lazy(() => import("./pages/Archive.jsx"));
const Category = lazy(() => import("./pages/Category"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function App() {
  const { isDark } = useTheme();

  return (
    <div className="App">
      <Suspense fallback={<Loader message="Loading..." />}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={2200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
}

export default App;