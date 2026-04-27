import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import YTDlpWrapModule from 'yt-dlp-wrap';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @ts-ignore
const YTDlpWrap = YTDlpWrapModule.default || YTDlpWrapModule;
const ytDlp = new YTDlpWrap('/usr/local/bin/yt-dlp');
const CLIPS_DIR = path.join(__dirname, 'public', 'clips');

if (!fs.existsSync(CLIPS_DIR)) {
  fs.mkdirSync(CLIPS_DIR, { recursive: true });
}

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/clips', express.static(CLIPS_DIR));

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

// Real Repurpose API
app.post('/api/repurpose', async (req, res) => {
  const { url, requestedClips, userId } = req.body;

  if (!url || !userId) {
    return res.status(400).json({ error: 'Missing URL or User ID' });
  }

  try {
    console.log(`Starting repurpose for: ${url}`);
    
    // 1. Get video info and direct stream URL
    const metadata: any = await ytDlp.getVideoInfo(url);
    const streamUrlsRaw = await ytDlp.execPromise([url, '-g', '-f', 'bestvideo+bestaudio/best']);
    const urls = streamUrlsRaw.trim().split('\n').map(u => u.trim());
    
    const videoTitle = metadata.title;
    const duration = metadata.duration;
    const savedClips = [];

    for (let i = 0; i < requestedClips; i++) {
      const startTime = Math.floor((duration * (i + 1)) / (requestedClips + 1));
      const clipDuration = 15;
      const clipId = `clip_${Date.now()}_${i}`;
      const outputFilename = `${clipId}.mp4`;
      const outputPath = path.join(CLIPS_DIR, outputFilename);
      const thumbnailFilename = `${clipId}.jpg`;
      const thumbnailPath = path.join(CLIPS_DIR, thumbnailFilename);

      console.log(`Processing clip ${i+1}/${requestedClips} starting at ${startTime}s`);

      // 3. Merge video and audio streams
      await new Promise((resolve, reject) => {
        console.log(`Final stream URLs:`, urls);
        let command = ffmpeg();
        
        // Add inputs with fast seeking AND reconnection options for each stream
        urls.forEach(u => {
          command = command.input(u).inputOptions([
            `-ss ${startTime}`,               // Fast seek BEFORE input for accuracy and speed
            '-reconnect 1',
            '-reconnect_at_eof 1',
            '-reconnect_streamed 1',
            '-reconnect_delay_max 2'
          ]);
        });
        
        command
          .setDuration(clipDuration)            // Keep the duration
          .outputOptions([
            '-map 0:v:0',                       // Map video from first input
            urls.length > 1 ? '-map 1:a:0' : '-map 0:a:0', // Map audio from second input if exists
            '-c:v libx264',                     // H.264 video codec
            '-c:a aac',                         // AAC audio codec
            '-b:a 192k',                        // High quality audio
            '-pix_fmt yuv420p',                 // Better compatibility
            '-preset ultrafast',                // Faster encoding for dev
            '-shortest'                         // Finish when shortest stream ends
          ])
          .output(outputPath)
          .on('start', (cmd) => console.log('Spawned FFmpeg with command: ' + cmd))
          .on('end', () => {
            console.log('Finished processing clip:', outputFilename);
            resolve(true);
          })
          .on('error', (err) => {
            console.error('FFmpeg processing error:', err);
            reject(err);
          })
          .run();
      });

      // 4. Generate Thumbnail
      await new Promise((resolve, reject) => {
        ffmpeg(outputPath)
          .screenshots({
            timestamps: [1],
            filename: thumbnailFilename,
            folder: CLIPS_DIR,
            size: '320x568'
          })
          .on('end', resolve)
          .on('error', reject);
      });

      // 5. Save to Database
      const newClip = await prisma.clip.create({
        data: {
          title: `Viral Moment from ${videoTitle.substring(0, 20)}...`,
          duration: `00:${clipDuration}`,
          style: 'Cyber Rose',
          timestamp: 'Just now',
          thumbnailUrl: `http://localhost:3001/clips/${thumbnailFilename}`,
          videoUrl: `http://localhost:3001/clips/${outputFilename}`,
          segmentTime: `${Math.floor(startTime / 60)}:${(startTime % 60).toString().padStart(2, '0')}`,
          userId: userId,
        },
      });

      savedClips.push(newClip);
    }

    res.json(savedClips);
  } catch (error) {
    console.error('Repurpose error:', error);
    res.status(500).json({ error: 'Failed to process video' });
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
  const { id } = req.params;
  try {
    const clip = await prisma.clip.findUnique({ where: { id } });
    if (!clip || !clip.videoUrl) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    // If it's a local clip, stream it. If it's an external URL, proxy it.
    if (clip.videoUrl.startsWith('http://localhost:3001/clips/')) {
      const filename = clip.videoUrl.split('/').pop();
      const filePath = path.join(CLIPS_DIR, filename!);
      
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'video/mp4');
      fs.createReadStream(filePath).pipe(res);
    } else {
       // Fallback for mock data
       res.redirect(clip.videoUrl);
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
