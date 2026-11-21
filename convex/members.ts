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
    passwordHash: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      throw new Error("MEMBER_EMAIL_EXISTS");
    }

    const id = await ctx.db.insert("members", {
      ...args,
      email: normalizedEmail,
    });
    return id;
  },
});

export const getMemberByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("members")
      .withIndex("by_email", (q) =>
        q.eq("email", args.email.toLowerCase().trim())
      )
      .first();
    if (!row) return null;
    return {
      id: row._id,
      fullName: row.fullName,
      nik: row.nik,
      phone: row.phone,
      email: row.email,
      village: row.village,
      passwordHash: row.passwordHash,
      createdAt: row.createdAt,
    };
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

export const updateMember = mutation({
  args: {
    id: v.id("members"),
    fullName: v.string(),
    nik: v.string(),
    phone: v.string(),
    email: v.string(),
    village: v.string(),
    ktpStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) return null;

    const normalizedEmail = args.email.toLowerCase().trim();
    if (normalizedEmail !== existing.email) {
      const duplicate = await ctx.db
        .query("members")
        .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
        .first();
      if (duplicate && duplicate._id !== args.id) {
        throw new Error("MEMBER_EMAIL_EXISTS");
      }
    }

    if (args.ktpStorageId && args.ktpStorageId !== existing.ktpStorageId) {
      await ctx.storage.delete(existing.ktpStorageId).catch(() => {});
    }

    const nextKtpId = args.ktpStorageId ?? existing.ktpStorageId;

    await ctx.db.patch(args.id, {
      fullName: args.fullName.trim(),
      nik: args.nik.trim(),
      phone: args.phone.trim(),
      email: normalizedEmail,
      village: args.village.trim(),
      ktpStorageId: nextKtpId,
    });

    return {
      id: existing._id,
      fullName: args.fullName.trim(),
      nik: args.nik.trim(),
      phone: args.phone.trim(),
      email: normalizedEmail,
      village: args.village.trim(),
      ktpFileName: nextKtpId,
      createdAt: existing.createdAt,
    };
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
