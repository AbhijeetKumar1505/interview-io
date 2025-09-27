import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setResumeData, setLoading, setError } from '../store/slices/resumeSlice';
import { extractTextFromFile, extractFields, getMissingFields } from '../utils/resumeParser';
import './ResumeUpload.css';

const ResumeUpload: React.FC = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
        setFile(selectedFile);
      } else {
        dispatch(setError('Please upload a PDF or DOCX file'));
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    dispatch(setLoading(true));

    try {
      const text = await extractTextFromFile(file);
      const extractedFields = extractFields(text);
      const missingFields = getMissingFields(extractedFields);

      dispatch(setResumeData({
        name: extractedFields.name,
        email: extractedFields.email,
        phone: extractedFields.phone,
        fullText: extractedFields.fullText,
        missingFields
      }));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to parse resume'));
    } finally {
      setUploading(false);
      dispatch(setLoading(false));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const fileName = droppedFile.name.toLowerCase();
      if (fileName.endsWith('.pdf') || fileName.endsWith('.docx')) {
        setFile(droppedFile);
      } else {
        dispatch(setError('Please upload a PDF or DOCX file'));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="resume-upload-container">
      <div
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <svg className="upload-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 5 17 10" />
          <line x1="12" y1="5" x2="12" y2="15" />
        </svg>

        <h3>Upload Your Resume</h3>
        <p>Drag and drop or click to browse</p>
        <p className="file-types">Accepted formats: PDF, DOCX</p>

        <input
          type="file"
          id="file-input"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <label htmlFor="file-input" className="browse-button">
          Browse Files
        </label>

        {file && (
          <div className="selected-file">
            <span>{file.name}</span>
            <button
              onClick={() => setFile(null)}
              className="remove-file"
              aria-label="Remove file"
            >
              ×
            </button>
          </div>
        )}

        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="upload-button"
          >
            {uploading ? 'Processing...' : 'Upload Resume'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;