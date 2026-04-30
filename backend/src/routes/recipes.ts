import { Router, Request, Response } from 'express'
import { fetchMakhanaRecipes } from '../lib/youtube'

const router = Router()

// GET /api/recipes
router.get('/', async (req: Request, res: Response) => {
  try {
    const { count = '10', category = 'All', pageToken = '' } = req.query;
    const maxResults = parseInt(count as string, 10) || 10;
    
    // Fetch recipes from YouTube API with pagination and category
    const { items, nextPageToken } = await fetchMakhanaRecipes(
      maxResults, 
      category as string, 
      pageToken as string
    );
    
    res.json({
      recipes: items,
      nextPageToken
    })
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' })
  }
})

export default router
