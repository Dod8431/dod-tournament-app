import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTournament } from "../firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { fetchYouTubeTitle } from "../utils/youtube";
import Papa from "papaparse";

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
  const reg =
    /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
  const match = url.match(reg);
  return match ? match[1] : "";
}

export default function CreateTournament() {
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("classic");
  const [pin, setPin] = useState("");
  const [videoCount, setVideoCount] = useState(8);
  const [videos, setVideos] = useState([
    { ytUrl: "", ytId: "", title: "" },
    { ytUrl: "", ytId: "", title: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleCountChange = (n) => {
    setVideoCount(n);
    setVideos(
      Array.from(
        { length: n },
        (_, i) => videos[i] || { ytUrl: "", ytId: "", title: "" }
      )
    );
  };

  const handleVideoChange = (idx, field, val) => {
    const copy = [...videos];
    copy[idx][field] = val;
    setVideos(copy);
  };

  // Upload CSV
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedVideos = results.data
          .flat()
          .map((url) => ({ ytUrl: url.trim(), ytId: "", title: "" }))
          .filter((v) => v.ytUrl.length > 0);

        setVideos(parsedVideos);
        setVideoCount(parsedVideos.length);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (videos.some((v) => !extractYouTubeID(v.ytUrl))) {
      setErr("Please enter valid YouTube links for all videos.");
      return;
    }
    setLoading(true);
    try {
      let vids = await Promise.all(
        videos.map(async (v) => {
          let ytId = extractYouTubeID(v.ytUrl);
          let title = await fetchYouTubeTitle(ytId);
          return { ytUrl: v.ytUrl, ytId, title, id: uuidv4() };
        })
      );

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
          round: 1,
        });
      }
      const bracket = [{ round: 1, matches }];

      const tournamentId = await createTournament({
        title,
        theme,
        adminId: localAdminId,
        adminPin: pin,
        videos: vids,
        bracket,
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
    classic:
      "bg-gradient-to-br from-[var(--main-dark)] to-[var(--main-gold-dark)] border-[var(--main-gold-dark)]",
    retro: "bg-gradient-to-br from-[#3c096c] to-[var(--main-bg)] border-[var(--main-bg)]",
    meme: "bg-gradient-to-br from-[#8843ff] to-[#a100fe] border-[var(--main-bg)]",
    dark: "bg-[var(--main-bg)] border-[var(--main-dark)]",
    light:
      "bg-[#ecdcf8] text-[var(--main-dark)] border-[var(--main-gold-dark)]",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <form
        className="u-card w-full max-w-lg flex flex-col gap-6 p-8 text-[var(--text)]"
        style={{ backdropFilter: "blur(8px)" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-black tracking-tight text-center mb-1 text-[var(--gold)] drop-shadow animate-fade-up">
          Create Tournament
        </h2>

        {/* Theme preview */}
        <div
          className={`transition-colors duration-500 border-4 rounded-xl h-12 w-full flex items-center justify-center text-lg font-bold shadow ${themeDemo[theme] || themeDemo.classic}`}
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)} Theme Preview
        </div>

        {err && (
          <div className="animate-fade-up bg-[#ff658422] text-[#ff6584] border border-[#ff6584] rounded-lg px-3 py-2 text-sm font-semibold shadow">
            {err}
          </div>
        )}

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Tournament Title"
          className="rounded-xl px-4 py-3 bg-[var(--bg)] border border-[var(--line)] focus:ring-2 focus:ring-[var(--gold)] outline-none transition text-[var(--text)]"
        />

        {/* Upload CSV */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Import YouTube Links (CSV):</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="rounded-xl px-4 py-2 bg-[var(--bg)] border border-[var(--line)] text-[var(--text)]"
          />
          {videos.length > 0 && (
            <span className="text-sm text-[var(--text-dim)]">
              {videos.length} videos imported
            </span>
          )}
        </div>

        {/* Theme select */}
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="font-semibold self-center w-32">Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded-xl px-4 py-2 bg-[var(--bg)] border border-[var(--line)] text-[var(--text)] focus:ring-2 focus:ring-[var(--gold)] font-semibold transition"
          >
            <option value="classic">Classic</option>
            <option value="retro">Retro</option>
            <option value="meme">Meme</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* Video count */}
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="font-semibold self-center w-32"># of Videos:</label>
          <select
            value={videoCount}
            onChange={(e) => handleCountChange(Number(e.target.value))}
            className="rounded-xl px-4 py-2 bg-[var(--bg)] border border-[var(--line)] text-[var(--text)] focus:ring-2 focus:ring-[var(--gold)] font-semibold transition"
          >
            {[2, 4, 8, 16, 32, 64, 128].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Manual links list */}
        <div className="max-h-72 overflow-y-auto flex flex-col gap-2 mt-2">
          {videos.map((v, idx) => (
            <input
              key={idx}
              type="text"
              className="rounded-xl px-4 py-3 bg-[var(--bg)] border border-[var(--line)] focus:ring-2 focus:ring-[var(--gold)] text-[var(--text)] font-semibold outline-none transition"
              required
              placeholder={`YouTube Link #${idx + 1}`}
              value={v.ytUrl}
              onChange={(e) => handleVideoChange(idx, "ytUrl", e.target.value)}
              autoComplete="off"
            />
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="u-btn u-btn--primary text-lg"
          disabled={loading}
        >
          {loading ? "Creating…" : "Create Tournament"}
        </button>
      </form>
    </div>
  );
}
