import db from "../Drizzle/db";
import { followers } from "../Drizzle/schema";
import { eq, and } from "drizzle-orm";

export class FollowersService {
  async followUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new Error("You cannot follow yourself");
    }

    // Check if already following
    const existingFollow = await db
      .select()
      .from(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId)
        )
      )
      .limit(1);

    if (existingFollow.length > 0) {
      throw new Error("Already following this user");
    }

    const [newFollow] = await db
      .insert(followers)
      .values({
        followerId,
        followingId,
      })
      .returning();

    return newFollow;
  }

  async unfollowUser(followerId: number, followingId: number) {
    if (followerId === followingId) {
      throw new Error("You cannot unfollow yourself");
    }

    const result = await db
      .delete(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId)
        )
      )
      .returning();

    if (result.length === 0) {
      throw new Error("Not following this user");
    }

    return true;
  }

  async getFollowers(userId: number) {
    const userFollowers = await db
      .select()
      .from(followers)
      .where(eq(followers.followingId, userId));

    return userFollowers;
  }

  async getFollowing(userId: number) {
    const userFollowing = await db
      .select()
      .from(followers)
      .where(eq(followers.followerId, userId));

    return userFollowing;
  }
}