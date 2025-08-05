import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, CardMedia, Chip, Grid } from '@mui/material';
import api from '../api/axios';

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts/').then(res => setPosts(res.data));
  }, []);

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5" align="center" gutterBottom>Feed</Typography>
        <Grid container spacing={3}>
          {posts.map(post => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image_url}
                  alt="Post"
                />
                <CardContent>
                  <Typography variant="body1">{post.description}</Typography>
                  <Box mt={1}>
                    {post.matched_products && Array.isArray(post.matched_products) && post.matched_products.length > 0 && (
                      <>
                        <Typography variant="subtitle2">Matched Products:</Typography>
                        {post.matched_products.map((item, idx) => (
                          <Chip key={idx} label={typeof item === 'string' ? item : item.name || JSON.stringify(item)} sx={{ m: 0.5 }} />
                        ))}
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Feed; 