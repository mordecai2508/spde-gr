import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getStudents } from '../../services/api';
import ErrorBoundary from '../../utils/ErrorBoundary';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents()
      .then(({ data }) => setStudents(data))
      .catch(() => setStudents([]))  // Graceful error
      .finally(() => setLoading(false));
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
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={students} columns={columns} loading={loading} pageSize={5} />
      </div>
    </ErrorBoundary>
  );
};

export default Students;