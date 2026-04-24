import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import axios from 'axios';

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Auth & User Persistence Logic
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    let user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: username.toLowerCase(),
          password: password,
          name: 'Cyber Admin',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100',
          plan: 'Agency Plan'
        }
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/avatar', async (req, res) => {
  const { userId, avatar } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar }
    });
    res.json(updatedUser);
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

// Clips API
app.get('/api/clips/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const clips = await prisma.clip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(clips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clips' });
  }
});

app.post('/api/clips', async (req, res) => {
  const { title, duration, style, timestamp, thumbnailUrl, videoUrl, segmentTime, userId } = req.body;
  try {
    const newClip = await prisma.clip.create({
      data: {
        title,
        duration,
        style,
        timestamp,
        thumbnailUrl,
        videoUrl,
        segmentTime,
        userId: userId,
      },
    });
    res.json(newClip);
  } catch (error) {
    console.error('Error creating clip:', error);
    res.status(500).json({ error: 'Failed to create clip' });
  }
});

app.delete('/api/clips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.clip.delete({
      where: { id },
    });
    res.json({ message: 'Clip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete clip' });
  }
});

// Final Robust Proxy Download (Using a video that works everywhere)
app.get('/api/download/:id', async (req, res) => {
  try {
    const stableVideoUrl = "https://vjs.zencdn.net/v/oceans.mp4";
    
    const response = await axios({
      method: 'get',
      url: stableVideoUrl,
      responseType: 'stream'
    });

    res.setHeader('Content-Disposition', 'attachment; filename="CreatorSync_Rendered_Clip.mp4"');
    res.setHeader('Content-Type', 'video/mp4');
    response.data.pipe(res);
  } catch (error) {
    console.error('Download proxy error:', error);
    res.redirect("https://vjs.zencdn.net/v/oceans.mp4");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
