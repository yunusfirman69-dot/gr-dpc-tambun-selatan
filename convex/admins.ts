import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const countAdmins = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("admins").collect();
    return all.length;
  },
});

export const getAdminByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
    if (!row) return null;
    return {
      id: row._id,
      fullName: row.fullName,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role,
      createdAt: row.createdAt,
    };
  },
});

export const listAdmins = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("admins").order("desc").collect();
    return rows.map((row) => ({
      id: row._id,
      fullName: row.fullName,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt,
    }));
  },
});

export const createAdmin = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("super_admin"), v.literal("editor")),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const allAdmins = await ctx.db.query("admins").collect();
    if (allAdmins.length >= 1) {
      throw new Error("ADMIN_LIMIT_REACHED");
    }

    const normalizedEmail = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      throw new Error("EMAIL_EXISTS");
    }

    const id = await ctx.db.insert("admins", {
      fullName: args.fullName.trim(),
      email: normalizedEmail,
      passwordHash: args.passwordHash,
      role: args.role,
      createdAt: args.createdAt,
    });

    return {
      id,
      fullName: args.fullName.trim(),
      email: normalizedEmail,
      role: args.role,
      createdAt: args.createdAt,
    };
  },
});

export const deleteAdmin = mutation({
  args: { id: v.id("admins") },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("admins").collect();
    if (all.length <= 1) {
      throw new Error("CANNOT_DELETE_LAST_ADMIN");
    }
    const target = await ctx.db.get(args.id);
    if (!target) return false;
    await ctx.db.delete(args.id);
    return true;
  },
});
