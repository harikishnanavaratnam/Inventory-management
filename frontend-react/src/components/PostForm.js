import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import api from '../api/axios';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Snackbar from '@mui/material/Snackbar';

function PostForm() {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogProduct, setDialogProduct] = useState(null);
  const [inferredLabels, setInferredLabels] = useState([]);
  const [attributes, setAttributes] = useState(null);
  const [matchMessage, setMatchMessage] = useState('');
  const [matchedType, setMatchedType] = useState('');
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setMatching(true);
      // Upload to Firebase
      const storageRef = ref(storage, `posts/${Date.now()}_${e.target.files[0].name}`);
      await uploadBytes(storageRef, e.target.files[0]);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      // Call /match/ endpoint
      try {
        const res = await api.post('/match/', { image_url: url });
        const matches = res.data.match_result?.matches || [];
        setSuggestions(matches);
        setSelectedSuggestions(matches);
        setInferredLabels(res.data.inferred_labels || []);
        setAttributes(res.data.attributes || null);
        setMatchMessage(res.data.match_result?.message || '');
        setMatchedType(res.data.match_result?.matched_type || '');
      } catch (err) {
        setSuggestions([]);
        setSelectedSuggestions([]);
        setInferredLabels([]);
        setAttributes(null);
        setMatchMessage('');
        setMatchedType('');
      }
      setMatching(false);
    }
  };

  const handleSuggestionToggle = (item) => {
    setSelectedSuggestions((prev) =>
      prev.includes(item)
        ? prev.filter((s) => s !== item)
        : [...prev, item]
    );
  };

  const handleSuggestionClick = (item) => {
    setDialogProduct(item);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogProduct(null);
  };

  const handleOpenFeedbackDialog = () => setOpenFeedbackDialog(true);
  const handleCloseFeedbackDialog = () => { setOpenFeedbackDialog(false); setFeedbackText(''); };
  const handleSendFeedback = async () => {
    try {
      await api.post('/feedback/', {
        feedback: feedbackText,
        image_url: imageUrl,
        inferred_labels: inferredLabels,
        attributes,
        timestamp: new Date().toISOString()
      });
      setOpenFeedbackDialog(false);
      setFeedbackText('');
      setSnackbarMsg('Thank you for your feedback!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMsg('Failed to send feedback.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const matchedProductsObj = {};
      selectedSuggestions.forEach(item => {
        matchedProductsObj[item.id] = item;
      });

      // If no matches, send as multipart/form-data (like curl)
      if (Object.keys(matchedProductsObj).length === 0) {
        const formData = new FormData();
        formData.append('description', description);
        // You must have the actual file object, not just the URL
        formData.append('file', imageFile);

        await api.post('/posts/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // If matches exist, send as JSON
        await api.post('/posts/', {
          description,
          image_url: imageUrl,
          matched_products: matchedProductsObj,
        });
      }

      setDescription('');
      setImageFile(null);
      setImageUrl('');
      setSuggestions([]);
      setSelectedSuggestions([]);
      setSnackbarMsg('Post created!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setError('Failed to create post');
      setSnackbarMsg('Failed to create post');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" align="center">Create Post</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Description" fullWidth margin="normal" value={description} onChange={e => setDescription(e.target.value)} required />
          <Box mt={2}>
            <Button variant="contained" component="label">
              {imageUrl ? 'Change Image' : 'Upload Image'}
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {imageUrl && <img src={imageUrl} alt="Post" width={80} style={{ marginLeft: 16 }} />}
            {matching && <CircularProgress size={24} sx={{ ml: 2 }} />}
          </Box>
          {imageUrl && (inferredLabels.length > 0 || matchMessage) && (
            <Box mt={3} mb={2} p={2} border={1} borderColor="#eee" borderRadius={2} bgcolor="#fafafa">
              {inferredLabels.length > 0 && (
                <Typography variant="subtitle2" gutterBottom>
                  <b>Extracted Features:</b> {inferredLabels.join(', ')}
                </Typography>
              )}
              {matchMessage && (
                <Typography variant="subtitle2" color={matchedType === 'full' ? 'success.main' : matchedType === 'partial' ? 'warning.main' : 'error.main'} gutterBottom>
                  <b>Inventory Search:</b> {matchMessage}
                </Typography>
              )}
            </Box>
          )}
          {suggestions.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle1">Suggestions:</Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {suggestions.map((item, idx) => (
                  <Box key={idx} display="flex" flexDirection="column" alignItems="center" sx={{ cursor: 'pointer' }}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover', borderRadius: 8, border: selectedSuggestions.includes(item) ? '2px solid #1976d2' : '2px solid transparent' }}
                      onClick={() => handleSuggestionToggle(item)}
                    />
                    <Chip
                      label={item.name}
                      color={selectedSuggestions.includes(item) ? 'primary' : 'default'}
                      onClick={() => handleSuggestionClick(item)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ))}
              </Box>
              {/* Feedback Loop UI */}
              <Box mt={2}>
                <Typography variant="body2">Didn’t find what you’re looking for?</Typography>
                <Button variant="outlined" size="small" onClick={handleOpenFeedbackDialog}>Send Feedback</Button>
              </Box>
              <Dialog open={openFeedbackDialog} onClose={handleCloseFeedbackDialog}>
                <DialogTitle>Send Feedback</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Describe what you were looking for or what went wrong"
                    multiline
                    rows={4}
                    fullWidth
                    value={feedbackText}
                    onChange={e => setFeedbackText(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseFeedbackDialog}>Cancel</Button>
                  <Button onClick={handleSendFeedback} disabled={!feedbackText.trim()}>Send</Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Box mt={3}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading || !imageUrl}>Create Post</Button>
          </Box>
        </form>
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {dialogProduct && (
            <>
              <Box display="flex" justifyContent="center" mb={2}>
                <img src={dialogProduct.image_url} alt={dialogProduct.name} width={120} style={{ borderRadius: 8 }} />
              </Box>
              <DialogContentText><b>Name:</b> {dialogProduct.name}</DialogContentText>
              <DialogContentText><b>Description:</b> {dialogProduct.description}</DialogContentText>
              <DialogContentText><b>Category:</b> {dialogProduct.category}</DialogContentText>
              <DialogContentText><b>Subcategory:</b> {dialogProduct.subcategory}</DialogContentText>
              <DialogContentText><b>Age Group:</b> {dialogProduct.agegroup}</DialogContentText>
              <DialogContentText><b>Mobility Type:</b> {dialogProduct.mobilitytype}</DialogContentText>
              <DialogContentText><b>Is Real Device:</b> {dialogProduct.isrealdevice ? 'Yes' : 'No'}</DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{
          style: { backgroundColor: snackbarSeverity === 'success' ? '#43a047' : '#d32f2f', color: '#fff' },
        }}
      />
    </Container>
  );
}

export default PostForm;