import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { fetchYouTubeTitle } from '../utils/youtube';

const themePreview = {
  classic: "bg-gradient-to-br from-blue-100 to-indigo-200 border-blue-500",
  retro: "bg-yellow-200 text-pink-700 font-mono border-yellow-400",
  meme: "bg-green-200 text-purple-900 border-green-400 font-bold",
  dark: "bg-gray-900 text-white border-gray-700",
  light: "bg-white text-black border-gray-300"
};

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
  const [pin, setPin] = useState("");
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
    // Quick check for empty or invalid links
    if (videos.some(v => !extractYouTubeID(v.ytUrl))) {
      setErr("Please enter valid YouTube links for all videos.");
      return;
    }
    setLoading(true);
    try {
      let vids = await Promise.all(videos.map(async (v) => {
        let ytId = extractYouTubeID(v.ytUrl);
        let title = await fetchYouTubeTitle(ytId);
        return { ytUrl: v.ytUrl, ytId, title, id: uuidv4() };
      }));
      vids = vids.sort(() => Math.random() - 0.5);
      const matches = [];
      for (let i = 0; i < vids.length; i += 2) {
        matches.push({
          id: uuidv4(),
          videoAId: vids[i]?.id,
          videoBId: vids[i + 1]?.id,
          votesA: 0,
          votesB: 0,
          votes: [],
          round: 1
        });
      }
      const bracket = [{ round: 1, matches }];
      const tournamentId = await createTournament({
        title, theme, adminId: localAdminId, adminPin: pin, videos: vids, bracket
      });
      setLoading(false);
      navigate(`/tournament/${tournamentId}/admin`);
    } catch (error) {
      setErr("Error creating tournament. Check YouTube links.");
      setLoading(false);
    }
  };

  const previewClass = `transition-colors duration-500 border-4 rounded-xl h-12 w-full mb-3 flex items-center justify-center text-lg ${themePreview[theme]}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <form className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg flex flex-col gap-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-2">Create Tournament</h2>
        <div className={previewClass}>
          {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme Preview
        </div>
        {err && <div className="bg-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">{err}</div>}
        <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Title" className="input input-bordered" />
        <div>
          <label className="font-semibold">Theme:</label>
          <select value={theme} onChange={e => setTheme(e.target.value)} className="input">
            <option value="classic">Classic</option>
            <option value="retro">Retro</option>
            <option value="meme">Meme</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Number of Videos:</label>
          <select value={videoCount} onChange={e => handleCountChange(Number(e.target.value))} className="input">
            {[2,4,8,16,32,64,128].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <input
          type="password"
          value={pin}
          onChange={e => setPin(e.target.value)}
          required
          minLength={4}
          placeholder="Admin PIN"
          className="input input-bordered"
        />
        <div className="max-h-72 overflow-y-auto flex flex-col gap-2 mt-2">
          {videos.map((v, idx) => (
            <div className="flex gap-2 items-center" key={idx}>
              <input
                type="text"
                className="input input-bordered flex-1"
                required
                placeholder={`YouTube Link #${idx + 1}`}
                value={v.ytUrl}
                onChange={e => handleVideoChange(idx, 'ytUrl', e.target.value)}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary mt-2" disabled={loading}>{loading ? 'Creating...' : 'Create Tournament'}</button>
      </form>
    </div>
  );
}

export default CreateTournament;
