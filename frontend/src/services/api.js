import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Ajusta la URL según tu backend
});

export const getStudents = () => {
  return api.get('/students');
};

export const uploadStudentsCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/students/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default api;