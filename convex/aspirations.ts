import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addAspiration = mutation({
  args: {
    fullName: v.string(),
    contact: v.string(),
    village: v.string(),
    message: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("aspirations", args);
    return id;
  },
});

export const listAspirations = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("aspirations").order("desc").collect();
    return rows.map((row) => ({
      id: row._id,
      fullName: row.fullName,
      contact: row.contact,
      village: row.village,
      message: row.message,
      createdAt: row.createdAt,
    }));
  },
});

export const deleteAspiration = mutation({
  args: { id: v.id("aspirations") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row) return false;
    await ctx.db.delete(args.id);
    return true;
  },
});
