import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/images`);
      setImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      fetchImages(); 
      alert("Image Uploaded Successfully!");
    } catch (error) {
      alert("Upload failed. Check console.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1><ImageIcon size={32} /> Cloud Media Gallery</h1>
        <p>MERN Stack Internship - Week 3 Task</p>
      </header>

      <section className="upload-section">
        <form onSubmit={handleUpload}>
          <input 
            type="file" 
            onChange={onFileChange} 
            accept="image/*"
            id="file-input"
          />
          <button type="submit" disabled={uploading}>
            {uploading ? <Loader2 className="spinner" /> : <Upload size={18} />}
            {uploading ? " Uploading..." : " Upload to Cloudinary"}
          </button>
        </form>
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
}

export default App;