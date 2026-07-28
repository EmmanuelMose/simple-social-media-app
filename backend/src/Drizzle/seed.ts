import db from "./db";
import {
  users,
  posts,
  comments,
  likes,
  followers,
  profileViews,
  complaints,
} from "./schema";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

async function seed() {
  try {
    console.log("Clearing existing data...");
    await db.delete(profileViews);
    await db.delete(complaints);
    await db.delete(likes);
    await db.delete(comments);
    await db.delete(followers);
    await db.delete(posts);
    await db.delete(users);

    console.log("Creating users...");
    const passwordHash = await bcrypt.hash("password123", 10);

    const userData = [
      {
        username: "john_doe",
        email: "john@example.com",
        fullName: "John Doe",
        passwordHash,
        bio: "Software developer and coffee lover.",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "admin" as const,
        isActive: true,
      },
      {
        username: "jane_smith",
        email: "jane@example.com",
        fullName: "Jane Smith",
        passwordHash,
        bio: "Travel enthusiast and photographer.",
        avatar: "https://i.pravatar.cc/150?img=2",
        role: "user" as const,
        isActive: true,
      },
      {
        username: "bob_wilson",
        email: "bob@example.com",
        fullName: "Bob Wilson",
        passwordHash,
        bio: "Music lover and guitar player.",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "user" as const,
        isActive: true,
      },
      {
        username: "alice_johnson",
        email: "alice@example.com",
        fullName: "Alice Johnson",
        passwordHash,
        bio: "Fitness coach.",
        avatar: "https://i.pravatar.cc/150?img=4",
        role: "user" as const,
        isActive: true,
      },
      {
        username: "charlie_brown",
        email: "charlie@example.com",
        fullName: "Charlie Brown",
        passwordHash,
        bio: "Technology enthusiast.",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "user" as const,
        isActive: true,
      },
      {
        username: "emma_davis",
        email: "emma@example.com",
        fullName: "Emma Davis",
        passwordHash,
        bio: "Artist and designer.",
        avatar: "https://i.pravatar.cc/150?img=6",
        role: "user" as const,
        isActive: true,
      },
      {
        username: "mike_taylor",
        email: "mike@example.com",
        fullName: "Mike Taylor",
        passwordHash,
        bio: "Food enthusiast.",
        avatar: "https://i.pravatar.cc/150?img=7",
        role: "user" as const,
        isActive: true,
      },
    ];

    const createdUsers = await db.insert(users).values(userData).returning();
    console.log(`Created ${createdUsers.length} users.`);

    console.log("Creating posts...");
    const postContents = [
      "Just had an amazing coffee today.",
      "Exploring a beautiful city.",
      "Working on a new project.",
      "Morning workout completed.",
      "Just deployed a new application.",
      "Enjoying the sunset.",
      "Reading a great book.",
      "Trying a new recipe.",
      "Weekend hiking trip.",
      "Finished a new painting.",
      "Recorded a new podcast.",
      "Thanks for all the support.",
      "Learning a new language.",
      "Movie night.",
      "Upgraded my gaming setup.",
    ];

    const mediaUrls = [
      "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      "https://res.cloudinary.com/demo/image/upload/v2/sample2.jpg",
      "https://res.cloudinary.com/demo/video/upload/v1/sample.mp4",
      "https://res.cloudinary.com/demo/image/upload/v3/sample3.jpg",
      "https://res.cloudinary.com/demo/video/upload/v2/sample2.mp4",
    ];

    const postData = [];
    for (let i = 0; i < 20; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const hasMedia = Math.random() > 0.4;
      let mediaUrl = null;
      let mediaType: "image" | "video" | "none" = "none";
      if (hasMedia) {
        const randomMedia = mediaUrls[Math.floor(Math.random() * mediaUrls.length)];
        mediaUrl = randomMedia;
        mediaType = randomMedia.includes("video") ? "video" : "image";
      }
      postData.push({
        userId: user.userId,
        content: postContents[Math.floor(Math.random() * postContents.length)],
        mediaUrl,
        mediaType,
      });
    }

    const createdPosts = await db.insert(posts).values(postData).returning();
    console.log(`Created ${createdPosts.length} posts.`);

    console.log("Creating comments...");
    const commentMessages = [
      "Great post.",
      "Amazing.",
      "Thanks for sharing.",
      "I agree.",
      "Well done.",
      "Very inspiring.",
      "Excellent.",
      "Nice work.",
      "Keep it up.",
      "Looking forward to more.",
    ];

    const commentData = [];
    for (let i = 0; i < 40; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const post = createdPosts[Math.floor(Math.random() * createdPosts.length)];
      commentData.push({
        userId: user.userId,
        postId: post.postId,
        content: commentMessages[Math.floor(Math.random() * commentMessages.length)],
      });
    }

    await db.insert(comments).values(commentData);
    console.log(`Created ${commentData.length} comments.`);

    console.log("Creating likes...");
    const likeMap = new Map();
    for (let i = 0; i < 60; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const post = createdPosts[Math.floor(Math.random() * createdPosts.length)];
      likeMap.set(`${user.userId}-${post.postId}`, {
        userId: user.userId,
        postId: post.postId,
      });
    }
    const likeData = Array.from(likeMap.values());
    if (likeData.length) {
      await db.insert(likes).values(likeData);
    }
    console.log(`Created ${likeData.length} likes.`);

    console.log("Creating followers...");
    const followerMap = new Map();
    for (let i = 0; i < 30; i++) {
      const follower = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const following = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      if (follower.userId !== following.userId) {
        followerMap.set(`${follower.userId}-${following.userId}`, {
          followerId: follower.userId,
          followingId: following.userId,
        });
      }
    }
    const followerData = Array.from(followerMap.values());
    if (followerData.length) {
      await db.insert(followers).values(followerData);
    }
    console.log(`Created ${followerData.length} followers.`);

    console.log("Creating profile views...");
    const viewMap = new Map();
    for (let i = 0; i < 20; i++) {
      const viewer = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const viewed = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      if (viewer.userId !== viewed.userId) {
        const key = `${viewer.userId}-${viewed.userId}`;
        if (!viewMap.has(key)) {
          viewMap.set(key, {
            viewerId: viewer.userId,
            viewedUserId: viewed.userId,
            viewedAt: faker.date.recent({ days: 30 }),
          });
        }
      }
    }
    const viewData = Array.from(viewMap.values());
    if (viewData.length) {
      await db.insert(profileViews).values(viewData);
    }
    console.log(`Created ${viewData.length} profile views.`);

    console.log("Creating complaints...");
    const complaintTexts = [
      "This post contains inappropriate content.",
      "User is spamming the feed.",
      "Harassment in comments.",
      "Fake account reporting.",
      "Offensive profile picture.",
      "Misleading information.",
      "Abusive behavior in comments.",
      "Post violates community guidelines.",
    ];
    const complaintStatuses = ["pending", "resolved", "dismissed"] as const;

    const complaintData = [];
    for (let i = 0; i < 8; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      complaintData.push({
        userId: user.userId,
        complaint: complaintTexts[Math.floor(Math.random() * complaintTexts.length)],
        status: complaintStatuses[Math.floor(Math.random() * complaintStatuses.length)],
      });
    }
    if (complaintData.length) {
      await db.insert(complaints).values(complaintData);
    }
    console.log(`Created ${complaintData.length} complaints.`);

    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed.");
    console.error(error);
    process.exit(1);
  }
}

seed();