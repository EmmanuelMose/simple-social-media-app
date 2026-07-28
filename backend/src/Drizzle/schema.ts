import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  unique,
  index,
  pgEnum,
  boolean,
  primaryKey
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// Users Table
export const users = pgTable(
  "users",
  {
    userId: serial("user_id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    bio: text("bio"),
    avatar: varchar("avatar", { length: 255 }),
    role: userRoleEnum("role").default("user").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    usernameIdx: index("username_idx").on(table.username),
    emailIdx: index("email_idx").on(table.email),
  })
);

// Posts Table
export const posts = pgTable(
  "posts",
  {
    postId: serial("post_id").primaryKey(),
    content: text("content").notNull(),
    image: varchar("image", { length: 255 }),
    userId: integer("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("post_user_id_idx").on(table.userId),
    createdAtIdx: index("post_created_at_idx").on(table.createdAt),
  })
);

// Comments Table
export const comments = pgTable(
  "comments",
  {
    commentId: serial("comment_id").primaryKey(),
    content: text("content").notNull(),
    userId: integer("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    postId: integer("post_id")
      .references(() => posts.postId, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdIdx: index("comment_post_id_idx").on(table.postId),
    userIdIdx: index("comment_user_id_idx").on(table.userId),
  })
);

// Likes Table
export const likes = pgTable(
  "likes",
  {
    likeId: serial("like_id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    postId: integer("post_id")
      .references(() => posts.postId, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueLike: unique("unique_like_per_user_post").on(table.userId, table.postId),
    postIdIdx: index("like_post_id_idx").on(table.postId),
    userIdIdx: index("like_user_id_idx").on(table.userId),
  })
);

// Followers Table
export const followers = pgTable(
  "followers",
  {
    followerId: integer("follower_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    followingId: integer("following_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueFollow: unique("unique_follow").on(table.followerId, table.followingId),
    pk: primaryKey(table.followerId, table.followingId),
    followerIdx: index("follower_idx").on(table.followerId),
    followingIdx: index("following_idx").on(table.followingId),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  followers: many(followers, { relationName: "followers" }),
  following: many(followers, { relationName: "following" }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.userId],
  }),
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.userId],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.postId],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.userId],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.postId],
  }),
}));

export const followersRelations = relations(followers, ({ one }) => ({
  follower: one(users, {
    fields: [followers.followerId],
    references: [users.userId],
    relationName: "followers",
  }),
  following: one(users, {
    fields: [followers.followingId],
    references: [users.userId],
    relationName: "following",
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
export type Follower = typeof followers.$inferSelect;
export type NewFollower = typeof followers.$inferInsert;