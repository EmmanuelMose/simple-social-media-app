import db from "./db";
import { users, posts, comments, likes, followers } from "./schema";
import * as bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data in correct order
    await db.delete(comments);
    await db.delete(likes);
    await db.delete(followers);
    await db.delete(posts);
    await db.delete(users);

    console.log("📦 Creating users...");

    // Create users
    const userData: Array<{
      username: string;
      email: string;
      passwordHash: string;
      fullName: string;
      bio: string;
      avatar: string;
      role: "user" | "admin";
      isActive: boolean;
    }> = [
      {
        username: "john_doe",
        email: "john@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        fullName: "John Doe",
        bio: "Software developer & coffee lover ☕",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "admin",
        isActive: true,
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        fullName: "Jane Smith",
        bio: "Travel enthusiast ✈️ | Photographer 📸",
        avatar: "https://i.pravatar.cc/150?img=2",
        role: "user",
        isActive: true,
      },
      {
        username: "bob_wilson",
        email: "bob@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        fullName: "Bob Wilson",
        bio: "Music lover 🎵 | Guitar player 🎸",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "user",
        isActive: true,
      },
      {
        username: "alice_johnson",
        email: "alice@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        fullName: "Alice Johnson",
        bio: "Fitness freak 💪 | Health coach 🥗",
        avatar: "https://i.pravatar.cc/150?img=4",
        role: "user",
        isActive: true,
      },
      {
        username: "charlie_brown",
        email: "charlie@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        fullName: "Charlie Brown",
        bio: "Tech geek 💻 | Gamer 🎮",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "user",
        isActive: true,
      },
      {
        username: "emma_davis",
        email: "emma@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        fullName: "Emma Davis",
        bio: "Artist & Designer 🎨 | Creative soul",
        avatar: "https://i.pravatar.cc/150?img=6",
        role: "user",
        isActive: true,
      },
      {
        username: "mike_taylor",
        email: "mike@example.com",
        passwordHash: await bcrypt.hash("password123", 10),
        fullName: "Mike Taylor",
        bio: "Foodie 🍜 | Cooking enthusiast",
        avatar: "https://i.pravatar.cc/150?img=7",
        role: "user",
        isActive: true,
      },
    ];

    const createdUsers = await db.insert(users).values(userData).returning();
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create posts
    console.log("📝 Creating posts...");
    const postData = [];
    const postContents = [
      "Just had the most amazing coffee at this new café! ☕ #coffeelover",
      "Exploring the beautiful streets of Paris today! 🗼 #travel",
      "Check out my new guitar cover of Bohemian Rhapsody 🎸",
      "Morning workout done! 💪 Starting the day right!",
      "Just deployed my new project! Check it out 🚀",
      "Sunset views from the rooftop 🌅",
      "Reading a great book on cognitive psychology 📚",
      "Trying out this new recipe, wish me luck! 🍳",
      "Beautiful day for a hike in the mountains! 🏔️",
      "Just finished my painting for the art show 🎨",
      "New podcast episode is out! 🎙️",
      "Grateful for all the support from my followers! ❤️",
      "Learning a new language is challenging but fun! 🌍",
      "Movie night with friends! 🎬",
      "Finally upgraded my gaming setup! 🎮",
    ];

    for (let i = 0; i < 20; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      postData.push({
        content: postContents[Math.floor(Math.random() * postContents.length)],
        userId: user.userId,
        image: Math.random() > 0.6 ? faker.image.url() : null,
      });
    }

    const createdPosts = await db.insert(posts).values(postData).returning();
    console.log(`✅ Created ${createdPosts.length} posts`);

    // Create comments
    console.log("💬 Creating comments...");
    const commentData = [];
    const commentContents = [
      "This is amazing! 🔥",
      "Great post! 👍",
      "I totally agree with you!",
      "Thanks for sharing!",
      "This made my day! 😊",
      "So inspiring! 💫",
      "Love this! ❤️",
      "Wow, incredible! ✨",
      "Keep up the good work! 💪",
      "This is exactly what I needed to hear!",
      "You are so talented! 🌟",
      "Can't wait to see more!",
      "Absolutely fantastic! 🎉",
      "This resonates with me so much!",
      "Beautiful! 😍",
    ];

    for (let i = 0; i < 40; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const post = createdPosts[Math.floor(Math.random() * createdPosts.length)];
      commentData.push({
        content: commentContents[Math.floor(Math.random() * commentContents.length)],
        userId: user.userId,
        postId: post.postId,
      });
    }

    const createdComments = await db.insert(comments).values(commentData).returning();
    console.log(`✅ Created ${createdComments.length} comments`);

    // Create likes
    console.log("❤️ Creating likes...");
    const likeData = [];
    for (let i = 0; i < 60; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const post = createdPosts[Math.floor(Math.random() * createdPosts.length)];
      likeData.push({
        userId: user.userId,
        postId: post.postId,
      });
    }

    // Remove duplicates
    const uniqueLikes = Array.from(
      new Map(likeData.map((item) => [`${item.userId}-${item.postId}`, item])).values()
    );

    if (uniqueLikes.length > 0) {
      await db.insert(likes).values(uniqueLikes);
    }
    console.log(`✅ Created ${uniqueLikes.length} likes`);

    // Create followers
    console.log("👥 Creating followers...");
    const followerData = [];
    for (let i = 0; i < 30; i++) {
      const follower = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const following = createdUsers[Math.floor(Math.random() * createdUsers.length)];

      if (follower.userId !== following.userId) {
        followerData.push({
          followerId: follower.userId,
          followingId: following.userId,
        });
      }
    }

    const uniqueFollowers = Array.from(
      new Map(
        followerData.map((item) => [`${item.followerId}-${item.followingId}`, item])
      ).values()
    );

    if (uniqueFollowers.length > 0) {
      await db.insert(followers).values(uniqueFollowers);
    }
    console.log(`✅ Created ${uniqueFollowers.length} followers`);

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();