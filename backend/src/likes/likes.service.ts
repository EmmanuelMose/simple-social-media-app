import db from "../Drizzle/db";
import { likes } from "../Drizzle/schema";
import { eq, and } from "drizzle-orm";

export class LikesService {
  async likePost(userId: number, postId: number) {
    // Check if already liked
    const existingLike = await db
      .select()
      .from(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.postId, postId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      throw new Error("Already liked this post");
    }

    const [newLike] = await db
      .insert(likes)
      .values({
        userId,
        postId,
      })
      .returning();

    return newLike;
  }

  async unlikePost(userId: number, postId: number) {
    const result = await db
      .delete(likes)
      .where(
        and(
          eq(likes.userId, userId),
          eq(likes.postId, postId)
        )
      )
      .returning();

    if (result.length === 0) {
      throw new Error("You have not liked this post");
    }

    return true;
  }

  async getPostLikes(postId: number) {
    const postLikes = await db
      .select()
      .from(likes)
      .where(eq(likes.postId, postId));

    return postLikes;
  }
}