import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTournament } from '../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { fetchYouTubeTitle } from '../utils/youtube';
import Papa from "papaparse"; // 👈 ajout

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

  // 👇 Nouveau handler CSV
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedVideos = results.data
          .flat()
          .map((url) => ({ ytUrl: url.trim(), ytId: '', title: '' }))
          .filter(v => v.ytUrl.length > 0);

        setVideos(parsedVideos);
        setVideoCount(parsedVideos.length);
        console.log(">>> CSV importé", parsedVideos);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
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
      console.error(error);
      setErr("Error creating tournament. Check YouTube links.");
      setLoading(false);
    }
  };

  const themeDemo = {
    classic: "bg-gradient-to-br from-[var(--main-dark)] to-[var(--main-gold-dark)] border-[var(--main-gold-dark)]",
    retro: "bg-gradient-to-br from-[#3c096c] to-[#--main-bg] border-[#--main-bg]",
    meme: "bg-gradient-to-br from-[#8843ff] to-[#a100fe] border-[#--main-bg]",
    dark: "bg-[var(--main-bg)] border-[var(--main-dark)]",
    light: "bg-[#ecdcf8] text-[var(--main-dark)] border-[var(--main-gold-dark)]",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--main-bg)] to-[var(--main-dark)]">
      <form
        className="w-full max-w-lg flex flex-col gap-6 shadow-2xl p-8 rounded-3xl bg-[var(--main-dark)] border-2.5 border-[var(--main-gold)] text-[var(--main-gold)]"
        style={{ boxShadow: "0 6px 40px 0 var(--main-gold-dark)", backdropFilter: "blur(8px)" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-black tracking-tight text-center mb-1 text-[var(--main-gold)] drop-shadow animate-fade-in">
          Create Tournament
        </h2>
        <div
          className={`transition-colors duration-500 border-4 rounded-xl h-12 w-full flex items-center justify-center text-lg font-bold shadow ${themeDemo[theme] || themeDemo.classic}`}
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme Preview
        </div>
        {err && (
          <div className="animate-fade-in bg-[#ff658422] text-[#ff6584] border border-[#ff6584] rounded-lg px-3 py-2 text-sm font-semibold shadow">
            {err}
          </div>
        )}

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="Tournament Title"
          className="rounded-xl px-4 py-3 text-base bg-[var(--main-bg)] border border-[var(--main-gold-dark)] focus:ring-2 focus:ring-[var(--main-gold)] outline-none transition text-[var(--main-gold)]"
        />

        {/* 👇 Nouveau champ upload CSV */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Import YouTube Links (CSV):</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="rounded-xl px-4 py-2 bg-[var(--main-bg)] border border-[var(--main-gold-dark)] text-[var(--main-gold)]"
          />
          {videos.length > 0 && (
            <span className="text-sm text-[var(--main-gold-dark)]">{videos.length} vidéos importées</span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <label className="font-semibold self-center w-32">Theme:</label>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            className="rounded-xl px-4 py-2 bg-[var(--main-bg)] border border-[var(--main-gold-dark)] text-[var(--main-gold)] focus:ring-2 focus:ring-[var(--main-gold)] font-semibold transition"
          >
            <option value="classic">Classic</option>
            <option value="retro">Retro</option>
            <option value="meme">Meme</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <label className="font-semibold self-center w-32"># of Videos:</label>
          <select
            value={videoCount}
            onChange={e => handleCountChange(Number(e.target.value))}
            className="rounded-xl px-4 py-2 bg-[var(--main-bg)] border border-[var(--main-gold-dark)] text-[var(--main-gold)] focus:ring-2 focus:ring-[var(--main-gold)] font-semibold transition"
          >
            {[2, 4, 8, 16, 32, 64, 128].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Liste manuelle (toujours dispo si pas de CSV) */}
        <div className="max-h-72 overflow-y-auto flex flex-col gap-2 mt-2">
          {videos.map((v, idx) => (
            <input
              key={idx}
              type="text"
              className="rounded-xl px-4 py-3 bg-[var(--main-bg)] border border-[var(--main-gold-dark)] focus:ring-2 focus:ring-[var(--main-gold)] text-[var(--main-gold)] font-semibold outline-none transition"
              required
              placeholder={`YouTube Link #${idx + 1}`}
              value={v.ytUrl}
              onChange={e => handleVideoChange(idx, 'ytUrl', e.target.value)}
              autoComplete="off"
            />
          ))}
        </div>

        <button
          type="submit"
          className="rounded-2xl px-6 py-3 mt-2 font-bold tracking-wide text-lg shadow bg-[var(--main-gold)] hover:bg-[var(--main-gold-dark)] text-[var(--main-dark)] transition-all duration-300 ease-out focus:ring-2 focus:ring-[var(--main-gold)]"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>
    </div>
  );
}

export default CreateTournament;
