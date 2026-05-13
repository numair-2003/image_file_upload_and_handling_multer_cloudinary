import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ImageGallery.css';

const ImageGallery = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/upload`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setImages(res.data);
        } catch (err) {
            console.error("Error fetching images!", err);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); 
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file first!");

        const formData = new FormData();
        formData.append('image', file); 

        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setMessage("Image uploaded successfully!");
            URL.revokeObjectURL(preview); 
            setPreview("");
            setFile(null);
            fetchImages(); 
        } catch (err) {
            setMessage("Error uploading the image!");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent delete this image?")) return;
        try {
            await axios.delete(`${API_URL}/api/upload/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setImages(images.filter(img => img._id !== id)); 
            setMessage("Image deleted successfully!");
        } catch (err) {
            console.error("Image deletion failed!", err);
            setMessage("Failed to delete the image!");
        }
    };

    return (
        <div className="gallery-container">
            <div className="upload-section">
                <h2>Manage Your Gallery</h2>
                <form onSubmit={handleUpload} className="upload-form">
                    <input type="file" accept="image/*" onChange={handleFileChange} id="file-input" />
                    <label htmlFor="file-input" className="file-label">
                        {file ? file.name : "Choose an Image"}
                    </label>
                    
                    {preview && (
                        <div className="preview-box">
                            <img src={preview} alt="Selected Preview" />
                        </div>
                    )}

                    <button type="submit" disabled={loading || !file}>
                        {loading ? "Uploading to Cloud..." : "Upload Now"}
                    </button>
                </form>
                {message && <p className="status-message">{message}</p>}
            </div>

            <hr className="divider" />

            <div className="gallery-section">
                <h3>Your Uploads</h3>
                {images.length === 0 ? (
                    <p className="empty-msg">No images found. Start by uploading one!</p>
                ) : (
                    <div className="image-grid">
                        {images.map((img) => (
                            <div key={img._id} className="image-card">
                                <img src={img.url} alt="User upload" loading="lazy" />
                                <button className="delete-btn" onClick={() => handleDelete(img._id)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;