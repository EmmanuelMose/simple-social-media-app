import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    userId: serial("user_id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    bio: text("bio"),
    avatar: varchar("avatar", { length: 255 }),
    role: userRoleEnum("role").default("user").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    usernameIndex: index("idx_users_username").on(table.username),
    emailIndex: index("idx_users_email").on(table.email),
  })
);

export const posts = pgTable(
  "posts",
  {
    postId: serial("post_id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIndex: index("idx_posts_user").on(table.userId),
    createdAtIndex: index("idx_posts_created_at").on(table.createdAt),
  })
);

export const comments = pgTable(
  "comments",
  {
    commentId: serial("comment_id").primaryKey(),
    postId: integer("post_id")
      .references(() => posts.postId, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id")
      .references(() => users.userId, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    postIndex: index("idx_comments_post").on(table.postId),
    userIndex: index("idx_comments_user").on(table.userId),
  })
);

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
    uniqueLike: uniqueIndex("idx_unique_like").on(
      table.userId,
      table.postId
    ),
    userIndex: index("idx_likes_user").on(table.userId),
    postIndex: index("idx_likes_post").on(table.postId),
  })
);

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
    uniqueFollow: uniqueIndex("idx_unique_follow").on(
      table.followerId,
      table.followingId
    ),
    followerIndex: index("idx_followers_follower").on(table.followerId),
    followingIndex: index("idx_followers_following").on(table.followingId),
  })
);

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