
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { fetchYouTubeTitle } from '../utils/youtube';

function getLocalAdminId() {
  let id = localStorage.getItem("adminId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("adminId", id);
  }
  return id;
}
const localAdminId = getLocalAdminId();

function extractYouTubeID(url) {
  const reg = /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
  const match = url.match(reg);
  return match ? match[1] : '';
}

function CreateTournament() {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('classic');
  const [pin, setPin] = useState('');
  const [videoCount, setVideoCount] = useState(8);
  const [videos, setVideos] = useState([
    { ytUrl: '', ytId: '', title: '' },
    { ytUrl: '', ytId: '', title: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleCountChange = (n) => {
    setVideoCount(n);
    setVideos(Array.from({ length: n }, (_, i) => videos[i] || { ytUrl: '', ytId: '', title: '' }));
  };

  const handleVideoChange = (idx, field, val) => {
    const copy = [...videos];
    copy[idx][field] = val;
    setVideos(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    // Process the pasted URLs
    const allVideos = videos.map((video) => {
      const ytId = extractYouTubeID(video.ytUrl);
      return ytId ? { ytUrl: video.ytUrl, ytId, title: video.title } : null;
    }).filter((video) => video !== null);

    if (allVideos.length < 2) {
      setErr('Please provide at least two YouTube video URLs.');
      setLoading(false);
      return;
    }

    // Create the tournament
    try {
      const tournamentData = {
        title,
        theme,
        pin,
        videos: allVideos,
        adminId: localAdminId,
      };
      const tournamentRef = await createTournament(tournamentData);
      navigate(`/tournament/${tournamentRef.id}`);
    } catch (error) {
      setErr('Error creating tournament.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Tournament Creation Form Fields */}
    </form>
  );
}

export default CreateTournament;
