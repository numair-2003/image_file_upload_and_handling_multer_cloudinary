import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  LogOut, 
  ShieldAlert 
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { fetchImagesAPI, uploadImageAPI } from './services/api';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <ImageIcon size={24} className="logo-icon" /> 
        <span className="logo-text">Cloud<span className="logo-bracket">Gallery</span></span>
      </div>
      <div className="nav-links">
        <Link to="/"><ImageIcon size={18} /> Gallery</Link>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="admin-link">
                <LayoutDashboard size={18} /> Admin
              </Link>
            )}
            <button onClick={logout} className="nav-btn-logout">
              <LogOut size={18} /> Logout ({user.name?.split(' ')[0] || "User"})
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

const GalleryView = ({ images, loading, uploading, onFileChange, handleUpload, fileInputRef }) => {
  const { user } = useAuth();

  return (
    <div className="app-main">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="logo">Media <span className="logo-bracket">Library</span></h1>
          <p className="header-sub">MERN Stack Week 3 Task</p>
        </div>
        <div className="stack-pills">
          <span className="pill">MongoDB</span>
          <span className="pill">Express</span>
          <span className="pill">React</span>
          <span className="pill">Cloudinary</span>
        </div>
      </header>
      <div className="grid">
        <aside className="upload-card">
          <h3>{user ? 'Upload Content' : 'Guest Access'}</h3>
          {user ? (
            <form onSubmit={handleUpload}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={onFileChange} 
                accept="image/*" 
                id="file-input" 
              />
              <button type="submit" disabled={uploading}>
                {uploading ? <Loader2 className="spinner" /> : <Upload size={18} />}
                {uploading ? " Processing..." : " Upload to Cloud"}
              </button>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Please <Link to="/login">Login</Link> to contribute to the gallery.</p>
            </div>
          )}
        </aside>
        <main className="gallery-section">
          <h2>Cloud Storage</h2>
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinner" size={32} />
              <span>Fetching remote media...</span>
            </div>
          ) : (
            <div className="image-grid">
              {Array.isArray(images) && images.length > 0 ? images.map((img) => (
                <div key={img._id} className="card">
                  <img src={img.url} alt="User Upload" loading="lazy" />
                  <div className="card-info">
                    <span>{new Date(img.createdAt).toLocaleDateString()}</span>
                    <code>IMG_{img._id?.slice(-4) || "0000"}</code>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <p>No media found in cloud storage!</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const fileInputRef = React.useRef(null);
  const { user, loading: authLoading } = useAuth();

  const loadImages = async () => {
    try {
      const res = await fetchImagesAPI();
      const data = res.data;
      if (Array.isArray(data)) {
        setImages(data);
      } else if (data && Array.isArray(data.data)) {
        setImages(data.data); 
      } else {
        setImages([]); 
      }
    } catch (error) {
      console.error("Gallery Sync Error:", error);
      setImages([]); 
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  if (authLoading) {
    return (
      <div className="loading-state" style={{ height: '100vh' }}>
        <Loader2 className="spinner" size={48} />
        <p>Initializing Secure Session...</p>
      </div>
    );
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image file!");

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await uploadImageAPI(formData);
      
      if (response.status === 201 || response.status === 200) {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        await loadImages(); 
        alert("Media successfully pushed to Cloudinary!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      const errorMsg = error.response?.data?.message || "Upload rejected. Check server logs!";
      alert(`Error: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <GalleryView 
              images={images} 
              loading={loadingImages} 
              uploading={uploading} 
              onFileChange={(e) => setFile(e.target.files[0])} 
              handleUpload={handleUpload} 
              fileInputRef={fileInputRef}
            />
          } />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          <Route path="/admin" element={
            user?.role === 'admin' ? (
              <div className="container" style={{padding: '2rem'}}>
                <header className="app-header">
                  <h1>Admin <span className="logo-bracket">Panel</span></h1>
                </header>
                <div className="upload-card">
                  <p>Welcome, {user.name}! Admin management tools are ready.</p>
                </div>
              </div>
            ) : (
              <div className="container" style={{padding: '2rem', textAlign: 'center'}}>
                <div className="banner-error" style={{marginBottom: '1rem', color: '#ff4d4d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                  <ShieldAlert size={30} />
                  <span style={{fontWeight: 'bold'}}>Access Denied. Admin privileges required!</span>
                </div>
                <Link to="/" className="pill" style={{textDecoration: 'none', display: 'inline-block'}}>Return to Gallery</Link>
              </div>
            )
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <footer className="app-footer">
          <code>&copy; 2026 CloudMedia Portfolio - Version 1.0.2</code>
        </footer>
      </div>
    </Router>
  );
}

export default App;