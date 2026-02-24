import { useState, useRef } from 'react';
import apiInstance from '../api/index.js';

export default function FileUpload({ value, onChange, placeholder }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');
    const fileRef = useRef();

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await apiInstance.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url = res.data.data.url;
            setPreview(url);
            onChange(url);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleClear = () => {
        setPreview('');
        onChange('');
        if (fileRef.current) fileRef.current.value = '';
    };

    const imgSrc = preview || value;
    const fullSrc = imgSrc && !imgSrc.startsWith('http')
        ? `${window.location.protocol}//${window.location.hostname}:3000${imgSrc}`
        : imgSrc;

    return (
        <div className="file-upload">
            {fullSrc && (
                <div className="file-upload-preview">
                    <img src={fullSrc} alt={placeholder || 'Preview'} />
                </div>
            )}
            <div className="file-upload-controls">
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                />
                {uploading && <span className="file-upload-status">Uploading...</span>}
                {imgSrc && (
                    <button type="button" className="btn-clear-file" onClick={handleClear}>✕</button>
                )}
            </div>
        </div>
    );
}
