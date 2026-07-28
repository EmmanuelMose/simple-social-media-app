import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { users, posts, followers, profileViews } from "../Drizzle/schema";
import { eq, and, or } from "drizzle-orm";

export class UsersService {
  async getUserProfile(userId: number, currentUserId?: number) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!user) throw new Error("User not found");

    const followersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followingId, userId));

    const followingCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(followers)
      .where(eq(followers.followerId, userId));

    const postsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(eq(posts.userId, userId));

    let isFollowed = false;
    if (currentUserId && currentUserId !== userId) {
      const follow = await db
        .select()
        .from(followers)
        .where(
          and(
            eq(followers.followerId, currentUserId),
            eq(followers.followingId, userId)
          )
        )
        .limit(1);
      isFollowed = follow.length > 0;
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      followersCount: Number(followersCount[0]?.count || 0),
      followingCount: Number(followingCount[0]?.count || 0),
      postsCount: Number(postsCount[0]?.count || 0),
      isFollowed,
    };
  }

  async updateUserProfile(
    userId: number,
    data: { fullName?: string; bio?: string | null; avatar?: string | null }
  ) {
    const [updatedUser] = await db
      .update(users)
      .set({
        fullName: data.fullName || undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        avatar: data.avatar || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.userId, userId))
      .returning();

    if (!updatedUser) throw new Error("User not found");
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async searchUsers(query: string, currentUserId?: number) {
    if (!query || query.length < 2) return [];

    const searchPattern = `%${query}%`;
    const results = await db
      .select()
      .from(users)
      .where(
        or(
          sql`${users.username} ILIKE ${searchPattern}`,
          sql`${users.fullName} ILIKE ${searchPattern}`
        )
      )
      .limit(10);

    const usersWithoutPassword = results.map(({ passwordHash, ...user }) => user);

    if (currentUserId) {
      const usersWithFollowStatus = await Promise.all(
        usersWithoutPassword.map(async (user) => {
          const follow = await db
            .select()
            .from(followers)
            .where(
              and(
                eq(followers.followerId, currentUserId),
                eq(followers.followingId, user.userId)
              )
            )
            .limit(1);
          return { ...user, isFollowed: follow.length > 0 };
        })
      );
      return usersWithFollowStatus;
    }
    return usersWithoutPassword;
  }

  async recordProfileView(viewerId: number, viewedUserId: number) {
    if (viewerId === viewedUserId) return null;
    const [view] = await db
      .insert(profileViews)
      .values({ viewerId, viewedUserId })
      .returning();
    return view;
  }

  async getProfileViewCount(userId: number) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(profileViews)
      .where(eq(profileViews.viewedUserId, userId));
    return Number(result[0]?.count || 0);
  }
}