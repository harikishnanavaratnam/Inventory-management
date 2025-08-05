import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const categories = ['Bicycle', 'Scooter', 'Wheelchair', 'Other'];
const subcategories = ['Manual', 'Electric', 'Other'];
const ageGroups = ['Child', 'Adult', 'Senior'];
const mobilityTypes = ['Mobility Aid', 'Toy', 'Other'];

function ProductForm({ editMode }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    age_group: '',
    mobility_type: '',
    is_real_device: false,
    image_url: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode && id) {
      api.get(`/products/`).then(res => {
        const prod = res.data.find(p => p.id === parseInt(id));
        if (prod) setForm(prod);
      });
    }
  }, [editMode, id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      setImageUploading(true);
      const file = e.target.files[0];
      setImageFile(file);
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setForm(f => ({ ...f, image_url: url }));
      setImageUploading(false);
    }
  };

  const handleUploadImage = async () => {
    return form.image_url;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const imageUrl = await handleUploadImage();
      const payload = { ...form, image_url: imageUrl };
      if (editMode && id) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products/', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" align="center">{editMode ? 'Edit' : 'Add'} Product</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} required />
          <TextField label="Description" name="description" fullWidth margin="normal" value={form.description} onChange={handleChange} required />
          <TextField select label="Category" name="category" fullWidth margin="normal" value={form.category} onChange={handleChange} required>
            {categories.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField select label="Subcategory" name="subcategory" fullWidth margin="normal" value={form.subcategory} onChange={handleChange} required>
            {subcategories.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField select label="Age Group" name="age_group" fullWidth margin="normal" value={form.age_group} onChange={handleChange} required>
            {ageGroups.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField select label="Mobility Type" name="mobility_type" fullWidth margin="normal" value={form.mobility_type} onChange={handleChange} required>
            {mobilityTypes.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <Box mt={2}>
            <input type="checkbox" name="is_real_device" checked={form.is_real_device} onChange={handleChange} /> Real Device
          </Box>
          <Box mt={2}>
            <Button variant="contained" component="label" disabled={imageUploading}>
              {form.image_url ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {imageUploading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            {form.image_url && <img src={form.image_url} alt="Product" width={80} style={{ marginLeft: 16 }} />}
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading || imageUploading || !form.image_url}>{editMode ? 'Update' : 'Add'} Product</Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default ProductForm; 