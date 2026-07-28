import db from "../Drizzle/db";
import { comments, users } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export class CommentsService {
  async createComment(userId: number, data: { postId: number; content: string }) {
    const [newComment] = await db
      .insert(comments)
      .values({
        content: data.content,
        userId: userId,
        postId: data.postId,
      })
      .returning();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    const { passwordHash, ...userWithoutPassword } = user || {};

    return {
      ...newComment,
      user: user ? userWithoutPassword : null,
    };
  }

  async getCommentsByPost(postId: number) {
    const postComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    const commentsWithUsers = await Promise.all(
      postComments.map(async (comment) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.userId, comment.userId))
          .limit(1);

        const { passwordHash, ...userWithoutPassword } = user || {};

        return {
          ...comment,
          user: user ? userWithoutPassword : null,
        };
      })
    );

    return commentsWithUsers;
  }

  async deleteComment(commentId: number, userId: number) {
    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.commentId, commentId))
      .limit(1);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("You are not authorized to delete this comment");
    }

    await db.delete(comments).where(eq(comments.commentId, commentId));
    return true;
  }
}