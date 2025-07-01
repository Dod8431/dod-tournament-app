import axios from 'axios';

// Put your YouTube API Key here (or in .env)
const YT_API_KEY = process.env.REACT_APP_YT_API_KEY || 'YOUR_YT_API_KEY';

export async function fetchYouTubeTitle(ytId) {
  if (!ytId) return '';
  try {
    const resp = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ytId}&key=${YT_API_KEY}`
    );
    return resp.data.items?.[0]?.snippet?.title || '';
  } catch (e) {
    return '';
  }
}
