'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type === 'audio/ogg') {
      setFile(uploadedFile);
      handlePrediction(uploadedFile);
    } else {
      setError('Please upload an OGG file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/ogg': ['.ogg']
    },
    maxFiles: 1
  });

  const handlePrediction = async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('audio', file);

      // Send the request to the backend
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      // Handle the response
      if (response.data && response.data.Success.prediction) {
        setPrediction(response.data.Success.prediction);
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error predicting bird:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error predicting bird. Please try again.');
      } else {
        setError('Error predicting bird. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-4xl mb-4">🎵</div>
          {isDragActive ? (
            <p className="text-lg">Drop the OGG file here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag and drop an OGG file here, or click to select</p>
              <p className="text-sm text-gray-500">Only OGG files are accepted</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {file && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Selected file: {file.name}</p>
          {isLoading ? (
            <div className="mt-4">
              <p className="text-gray-600">Analyzing bird sound...</p>
              <div className="animate-pulse h-2 bg-gray-200 rounded mt-2"></div>
            </div>
          ) : prediction && (
            <div className="mt-4">
              <p className="font-medium text-green-600">Prediction:</p>
              <p className="text-lg">{prediction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 