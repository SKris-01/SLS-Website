import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export const fetchMakhanaRecipes = async (maxResults = 10, category = '', pageToken = '') => {
  try {
    const searchQuery = category && category !== 'All' 
        ? `makhana ${category} recipe -shorts` 
        : 'makhana recipe -shorts';

    const response = await youtube.search.list({
      part: ['snippet'],
      q: searchQuery,
      type: ['video'],
      videoDuration: 'medium', // Fetches videos between 4 and 20 minutes
      maxResults: Math.min(maxResults * 2, 50), 
      pageToken: pageToken || undefined,
      order: 'relevance',
      relevanceLanguage: 'en',
    });

    if (!response.data.items) return { items: [], nextPageToken: null };

    // Manual filtering for Shorts
    const filteredVideos = response.data.items
      .filter(item => {
        const title = item.snippet?.title?.toLowerCase() || '';
        const description = item.snippet?.description?.toLowerCase() || '';
        return !title.includes('shorts') && 
               !description.includes('#shorts') && 
               !title.includes('#shorts');
      })
      .slice(0, maxResults);

    const items = filteredVideos.map(item => ({
      id: item.id?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
      channel: item.snippet?.channelTitle,
      link: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
      publishedAt: item.snippet?.publishedAt,
      type: category !== 'All' ? category : 'Recipe',
      isActive: true,
    }));

    return {
      items,
      nextPageToken: response.data.nextPageToken || null,
    };
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return { items: [], nextPageToken: null };
  }
};
