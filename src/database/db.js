import Dexie from 'dexie';
import { 
  dummyUsers, 
  dummyPosts, 
  dummyThoughts, 
  dummyStories 
} from '../DummyData/data';

const db = new Dexie('SocialMediaDB');

// Enhanced schema with proper indexes
db.version(1).stores({
  users: 'userId, name, email',
  user_posts: '++postId, userId',
  user_thoughts: '++thoughtId, userId',
  user_stories: '++storyId, userId'
});

// Data initialization with checks
export async function initializeDummyData() {
  try {
    // Using transaction for atomic operations
    await db.transaction('rw', db.users, db.user_posts, db.user_thoughts, db.user_stories, async () => {
      // Clear existing data
      await Promise.all([
        db.users.clear(),
        db.user_posts.clear(),
        db.user_thoughts.clear(),
        db.user_stories.clear()
      ]);

      // Use bulkPut instead of bulkAdd to prevent duplicate errors
      await Promise.all([
        db.users.bulkPut(dummyUsers),
        db.user_posts.bulkPut(dummyPosts),
        db.user_thoughts.bulkPut(dummyThoughts),
        db.user_stories.bulkPut(dummyStories)
      ]);
    });
    
    console.log("Dummy data initialized successfully!");
    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    return false;
  }
}

// Enhanced user profile fetcher
export async function getUserProfile(userId) {
  return db.transaction('r', db.users, db.user_posts, db.user_thoughts, db.user_stories, async () => {
    const [user, posts, thoughts, stories] = await Promise.all([
      db.users.get({ userId }),
      db.user_posts.where('userId').equals(userId).toArray(),
      db.user_thoughts.where('userId').equals(userId).toArray(),
      db.user_stories.where('userId').equals(userId).toArray()
    ]);
    
    return { user, posts, thoughts, stories };
  });
}

export default db;