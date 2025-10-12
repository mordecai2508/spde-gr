import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getStudents, uploadStudentsCSV } from '../../services/api';
import ErrorBoundary from '../../utils/ErrorBoundary';

const CsvUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await uploadStudentsCSV(file);
      setResult(data);
      onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <p>{result.message}</p>
          <p>Created: {result.created}</p>
          {result.errors && result.errors.length > 0 && (
            <div>
              <p>Errors:</p>
              <ul>
                {result.errors.map((err, index) => (
                  <li key={index}>{JSON.stringify(err.row)} - {err.error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = () => {
    setLoading(true);
    getStudents()
      .then(({ data }) => setStudents(data))
      .catch(() => setStudents([]))  // Graceful error
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns = [
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'student_code', headerName: 'Code', width: 120 },
    { field: 'program', headerName: 'Program', width: 130 },
    // Add more...
  ];

  return (
    <ErrorBoundary>
      <CsvUpload onUploadSuccess={fetchStudents} />
      <div style={{ height: 400, width: '100%', marginTop: 16 }}>
        <DataGrid rows={students} columns={columns} loading={loading} pageSize={5} />
      </div>
    </ErrorBoundary>
  );
};

export default Students;