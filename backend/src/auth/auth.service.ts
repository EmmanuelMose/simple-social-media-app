import db from "../Drizzle/db";
import { users } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export class AuthService {
  async register(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    bio?: string;
  }) {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error("User with this email already exists");
    }

    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    if (existingUsername.length > 0) {
      throw new Error("Username already taken");
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        username: data.username,
        email: data.email,
        passwordHash: hashedPassword,
        fullName: data.fullName,
        bio: data.bio || null,
        role: "user",
        isActive: true,
      })
      .returning();

    // Generate token
    const token = jwt.sign(
      {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { passwordHash, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(data: { email: string; password: string }) {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isPasswordValid = await comparePassword(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getCurrentUser(userId: number) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId))
      .limit(1);

    if (!user) {
      throw new Error("User not found");
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}