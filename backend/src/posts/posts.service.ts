import db from "../Drizzle/db";
import { posts, users, likes, comments, followers } from "../Drizzle/schema";
import { eq, desc, and, count, inArray } from "drizzle-orm";

export class PostsService {
  async createPost(userId: number, data: { content: string; image?: string }) {
    const [newPost] = await db
      .insert(posts)
      .values({
        content: data.content,
        image: data.image || null,
        userId: userId,
      })
      .returning();

    return newPost;
  }

  async getFeed(userId: number, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    // Get users that the current user follows
    const following = await db
      .select()
      .from(followers)
      .where(eq(followers.followerId, userId));

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId);

    const feedPosts = await db
      .select()
      .from(posts)
      .where(inArray(posts.userId, followingIds))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get post details with user info, likes, comments
    const postsWithDetails = await Promise.all(
      feedPosts.map(async (post) => {
        const [postUser] = await db
          .select()
          .from(users)
          .where(eq(users.userId, post.userId))
          .limit(1);

        const likesCount = await db
          .select({ count: count() })
          .from(likes)
          .where(eq(likes.postId, post.postId));

        const commentsCount = await db
          .select({ count: count() })
          .from(comments)
          .where(eq(comments.postId, post.postId));

        const isLiked = await db
          .select()
          .from(likes)
          .where(
            and(
              eq(likes.postId, post.postId),
              eq(likes.userId, userId)
            )
          )
          .limit(1);

        const { passwordHash, ...userWithoutPassword } = postUser || {};

        return {
          ...post,
          user: postUser ? userWithoutPassword : null,
          likesCount: Number(likesCount[0]?.count || 0),
          commentsCount: Number(commentsCount[0]?.count || 0),
          isLiked: isLiked.length > 0,
        };
      })
    );

    return postsWithDetails;
  }

  async getPostById(postId: number, userId: number) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.postId, postId))
      .limit(1);

    if (!post) {
      throw new Error("Post not found");
    }

    const [postUser] = await db
      .select()
      .from(users)
      .where(eq(users.userId, post.userId))
      .limit(1);

    const likesCount = await db
      .select({ count: count() })
      .from(likes)
      .where(eq(likes.postId, postId));

    const commentsCount = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.postId, postId));

    const isLiked = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.postId, postId),
          eq(likes.userId, userId)
        )
      )
      .limit(1);

    const { passwordHash, ...userWithoutPassword } = postUser || {};

    return {
      ...post,
      user: postUser ? userWithoutPassword : null,
      likesCount: Number(likesCount[0]?.count || 0),
      commentsCount: Number(commentsCount[0]?.count || 0),
      isLiked: isLiked.length > 0,
    };
  }

  async deletePost(postId: number, userId: number) {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.postId, postId))
      .limit(1);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== userId) {
      throw new Error("You are not authorized to delete this post");
    }

    await db.delete(posts).where(eq(posts.postId, postId));
    return true;
  }
}