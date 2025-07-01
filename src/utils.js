// src/utils.js
export const extractYouTubeID = (url) => {
  const reg = /(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
  const match = url.match(reg);
  return match ? match[1] : '';
};
export default extractYouTubeID;
