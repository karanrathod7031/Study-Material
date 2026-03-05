import axios from 'axios';

const API_URL = 'https://study-material-19vf.onrender.com';

export const assetService = {
  fetchAssets: async (parentId) => {
    const res = await axios.get(`${API_URL}?parentId=${parentId || 'null'}`);
    return res.data;
  },

  uploadFile: async (file, parentId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('parentId', parentId || 'null');
    const res = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  createFolder: async (title, parentId) => {
    const res = await axios.post(`${API_URL}/folder`, { title, parentId: parentId || null });
    return res.data;
  },

  deleteAsset: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },

  renameAsset: async (id, newTitle) => {
    const res = await axios.put(`${API_URL}/${id}`, { title: newTitle });
    return res.data;
  }
};
