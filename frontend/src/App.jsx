import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Upload, Image as ImageIcon, Loader2, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';

import { useAuth } from './context/AuthContext';
import { fetchImagesAPI, uploadImageAPI } from './services/api';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <ImageIcon size={24} /> <span>CloudGallery</span>
      </div>
      <div className="nav-links">
        <Link to="/"><ImageIcon size={18} /> Gallery</Link>
        
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin"><LayoutDashboard size={18} /> Admin</Link>
            )}
            <button onClick={logout} className="nav-btn-logout">
              <LogOut size={18} /> Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login"><LogIn size={18} /> Login</Link>
            <Link to="/signup"><UserPlus size={18} /> Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const GalleryView = ({ images, loading, uploading, onFileChange, handleUpload }) => {
  const { user } = useAuth();

  return (
    <div className="container">
      <header>
        <h1>Cloud Media Gallery</h1>
        <p>MERN Stack Internship - Week 3 Task</p>
      </header>

      <section className="upload-section">
        {user ? (
          <form onSubmit={handleUpload}>
            <input type="file" onChange={onFileChange} accept="image/*" id="file-input" />
            <button type="submit" disabled={uploading}>
              {uploading ? <Loader2 className="spinner" /> : <Upload size={18} />}
              {uploading ? " Uploading..." : " Upload to Cloudinary"}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please <Link to="/login">Login</Link> to upload images to the cloud.</p>
          </div>
        )}
      </section>

      <hr />

      <section className="gallery-section">
        <h2>Your Gallery</h2>
        {loading ? (
          <div className="loading-state"><Loader2 className="spinner" /> Loading Gallery...</div>
        ) : (
          <div className="grid">
            {images.length > 0 ? images.map((img) => (
              <div key={img._id} className="card">
                <img src={img.url} alt="Uploaded" />
                <div className="card-info">
                  <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            )) : <p>No images found. Start uploading!</p>}
          </div>
        )}
      </section>
    </div>
  );
};

function App() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadImages = async () => {
    try {
      const { data } = await fetchImagesAPI();
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const onFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploading(true);
      await uploadImageAPI(formData);
      setFile(null);
      loadImages(); 
      alert("Image Uploaded Successfully!");
    } catch (error) {
      alert("Image file upload failed. Make sure you are logged in!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <GalleryView 
            images={images} 
            loading={loading} 
            uploading={uploading} 
            onFileChange={onFileChange} 
            handleUpload={handleUpload} 
          />
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/admin" element={
          user?.role === 'admin' ? (
            <div className="container"><h2>Admin Dashboard</h2><p>Welcome, Administrator!</p></div>
          ) : (
            <div className="container"><h2>Access Denied!</h2><p>You do not have permission to view this page.</p></div>
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;