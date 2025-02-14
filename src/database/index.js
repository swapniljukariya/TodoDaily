import { dummyUsers, dummyPosts, dummyThoughts, dummyStories } from './dummyData';

// Initialize Dexie DB (use your existing setup)
const db = new Dexie('SocialMediaDB');
db.version(1).stores({
  users: 'userId',
  user_posts: 'postId, userId',
  user_thoughts: 'thoughtId, userId',
  user_stories: 'storyId, userId'
});

// Insert dummy data (run once)
async function initializeDummyData() {
  await db.users.bulkAdd(dummyUsers);
  await db.user_posts.bulkAdd(dummyPosts);
  await db.user_thoughts.bulkAdd(dummyThoughts);
  await db.user_stories.bulkAdd(dummyStories);
  console.log("Dummy data inserted!");
}

// Call this once (e.g., on app load)
initializeDummyData().catch(console.error);