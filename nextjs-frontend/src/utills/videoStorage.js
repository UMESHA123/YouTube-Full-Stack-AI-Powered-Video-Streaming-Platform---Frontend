const STORAGE_KEY = "video_notifications";

export const getStoredVideos = () => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveVideo = (video) => {
  const existing = getStoredVideos();
  const isAlreadyStored = existing.some(v => v.videoId === video.videoId);
  if (!isAlreadyStored) {
    existing.unshift(video);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }
};

export const clearVideos = () => localStorage.removeItem(STORAGE_KEY);
