// src/utils.js
// YouTube ID extraction util, can be imported where needed
export function extractYouTubeID(url) {
  const reg = /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
  const match = url.match(reg);
  return match ? match[1] : '';
}