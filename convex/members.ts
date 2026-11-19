import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMember = mutation({
  args: {
    fullName: v.string(),
    nik: v.string(),
    phone: v.string(),
    email: v.string(),
    village: v.string(),
    ktpStorageId: v.id("_storage"),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("members", args);
    return id;
  },
});

export const listMembers = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("members").order("desc").collect();
    return rows.map((row) => ({
      id: row._id,
      fullName: row.fullName,
      nik: row.nik,
      phone: row.phone,
      email: row.email,
      village: row.village,
      ktpFileName: row.ktpStorageId,
      createdAt: row.createdAt,
    }));
  },
});

export const deleteMember = mutation({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row) return false;
    await ctx.storage.delete(row.ktpStorageId).catch(() => {});
    await ctx.db.delete(args.id);
    return true;
  },
});
