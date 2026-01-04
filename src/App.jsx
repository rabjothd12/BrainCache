import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateBlog from "./pages/CreateBlog";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogList from "./pages/BlogList";
import ReadBlog from "./pages/ReadBlog";


function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/write" element={<ProtectedRoute> <CreateBlog /> </ProtectedRoute>}/>
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/:id" element={<ProtectedRoute><ReadBlog /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
