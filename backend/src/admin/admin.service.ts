import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { users, posts, comments, complaints } from "../Drizzle/schema";
import { eq, desc } from "drizzle-orm";

export class AdminService {
  async getAllUsers(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const userList = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const total = await db.select({ count: sql<number>`count(*)` }).from(users);
    return {
      users: userList.map(({ passwordHash, ...u }) => u),
      total: total[0]?.count || 0,
      page,
      limit,
    };
  }

  async updateUserRole(userId: number, role: 'user' | 'admin') {
    const [updated] = await db
      .update(users)
      .set({ role })
      .where(eq(users.userId, userId))
      .returning();
    if (!updated) throw new Error('User not found');
    const { passwordHash, ...user } = updated;
    return user;
  }

  async deleteUser(userId: number) {
    const [deleted] = await db
      .delete(users)
      .where(eq(users.userId, userId))
      .returning({ id: users.userId });
    if (!deleted) throw new Error('User not found');
    return true;
  }

  async getComplaints(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const complaintList = await db
      .select()
      .from(complaints)
      .orderBy(desc(complaints.createdAt))
      .limit(limit)
      .offset(offset);

    const total = await db.select({ count: sql<number>`count(*)` }).from(complaints);
    return {
      complaints: complaintList,
      total: total[0]?.count || 0,
      page,
      limit,
    };
  }

  async resolveComplaint(complaintId: number, status: 'resolved' | 'dismissed') {
    const [updated] = await db
      .update(complaints)
      .set({ status, updatedAt: new Date() })
      .where(eq(complaints.complaintId, complaintId))
      .returning();
    if (!updated) throw new Error('Complaint not found');
    return updated;
  }

  async getAnalytics() {
    const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
    const postCount = await db.select({ count: sql<number>`count(*)` }).from(posts);
    const commentCount = await db.select({ count: sql<number>`count(*)` }).from(comments);
    const complaintCount = await db.select({ count: sql<number>`count(*)` }).from(complaints);
    return {
      totalUsers: userCount[0]?.count || 0,
      totalPosts: postCount[0]?.count || 0,
      totalComments: commentCount[0]?.count || 0,
      totalComplaints: complaintCount[0]?.count || 0,
    };
  }

  async getResults() {
    const topPosts = await db
      .select({
        postId: posts.postId,
        content: posts.content,
        likes: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.post_id)`,
        comments: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.post_id)`,
        totalEngagement: sql<number>`(SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.post_id) + (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.post_id)`,
      })
      .from(posts)
      .orderBy(sql`totalEngagement DESC`)
      .limit(5);
    return topPosts;
  }
}