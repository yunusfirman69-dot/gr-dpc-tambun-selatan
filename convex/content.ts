import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// === NEWS ===
export const listNews = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("news").order("desc").collect();
    return Promise.all(
      rows.map(async (row) => ({
        slug: row.slug,
        title: row.title,
        category: row.category,
        publishedAt: row.publishedAt,
        excerpt: row.excerpt,
        content: row.content,
        author: row.author,
        imageUrl: row.imageStorageId
          ? (await ctx.storage.getUrl(row.imageStorageId)) ?? row.imageUrl
          : row.imageUrl,
      }))
    );
  },
});

export const getNewsBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("news")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!row) return null;
    return {
      slug: row.slug,
      title: row.title,
      category: row.category,
      publishedAt: row.publishedAt,
      excerpt: row.excerpt,
      content: row.content,
      author: row.author,
      imageUrl: row.imageStorageId
        ? (await ctx.storage.getUrl(row.imageStorageId)) ?? row.imageUrl
        : row.imageUrl,
    };
  },
});

export const addNews = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    publishedAt: v.string(),
    excerpt: v.string(),
    content: v.array(v.string()),
    author: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("news", args);
    const resolvedUrl = args.imageStorageId
      ? (await ctx.storage.getUrl(args.imageStorageId)) ?? args.imageUrl
      : args.imageUrl;
    return {
      slug: args.slug,
      title: args.title,
      category: args.category,
      publishedAt: args.publishedAt,
      excerpt: args.excerpt,
      content: args.content,
      author: args.author,
      imageUrl: resolvedUrl,
    };
  },
});

export const deleteNews = mutation({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("news")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!row) return false;
    if (row.imageStorageId) {
      await ctx.storage.delete(row.imageStorageId).catch(() => {});
    }
    await ctx.db.delete(row._id);
    return true;
  },
});

// === GALLERY ===
export const listGallery = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("gallery").order("desc").collect();
    return Promise.all(
      rows.map(async (row) => ({
        id: row._id,
        title: row.title,
        category: row.category,
        date: row.date,
        description: row.description,
        imageUrl: row.imageStorageId
          ? (await ctx.storage.getUrl(row.imageStorageId)) ?? row.imageUrl
          : row.imageUrl,
      }))
    );
  },
});

export const addGallery = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    date: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("gallery", args);
    const resolvedUrl = args.imageStorageId
      ? (await ctx.storage.getUrl(args.imageStorageId)) ?? args.imageUrl
      : args.imageUrl;
    return {
      id,
      title: args.title,
      category: args.category,
      date: args.date,
      description: args.description,
      imageUrl: resolvedUrl,
    };
  },
});

export const deleteGallery = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row) return false;
    if (row.imageStorageId) {
      await ctx.storage.delete(row.imageStorageId).catch(() => {});
    }
    await ctx.db.delete(args.id);
    return true;
  },
});

// === PROGRAM KERJA ===
export const getProgramKerja = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("programKerja")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();
    if (!row) return null;
    return {
      intro: row.intro,
      landasan: row.landasan,
      fields: row.fields,
      implementationMatrix: row.implementationMatrix,
    };
  },
});

export const saveProgramKerja = mutation({
  args: {
    intro: v.string(),
    landasan: v.string(),
    fields: v.array(
      v.object({
        number: v.string(),
        title: v.string(),
        pillar: v.string(),
        focus: v.string(),
        items: v.array(
          v.object({
            name: v.string(),
            description: v.string(),
          })
        ),
      })
    ),
    implementationMatrix: v.array(
      v.object({
        field: v.string(),
        shortTerm: v.string(),
        mediumTerm: v.string(),
        indicator: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("programKerja")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("programKerja", { key: "default", ...args });
    }
    return args;
  },
});

// === OFFICIALS ===
export const listOfficials = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("officials")
      .withIndex("by_order")
      .collect();
    return rows.map((r) => ({
      id: r.externalId,
      name: r.name,
      position: r.position,
      division: r.division,
      period: r.period,
      bio: r.bio,
      photoUrl: r.photoUrl,
      photoFit: r.photoFit,
      photoPosition: r.photoPosition,
      photoShape: r.photoShape,
    }));
  },
});

export const saveOfficials = mutation({
  args: {
    officials: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        position: v.string(),
        division: v.string(),
        period: v.string(),
        bio: v.string(),
        photoUrl: v.optional(v.string()),
        photoFit: v.optional(v.union(v.literal("cover"), v.literal("contain"))),
        photoPosition: v.optional(
          v.union(v.literal("top"), v.literal("center"), v.literal("bottom"))
        ),
        photoShape: v.optional(
          v.union(v.literal("square"), v.literal("circle"), v.literal("portrait"))
        ),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("officials").collect();
    for (const row of existing) {
      await ctx.db.delete(row._id);
    }
    for (let i = 0; i < args.officials.length; i++) {
      const o = args.officials[i];
      await ctx.db.insert("officials", {
        externalId: o.id,
        order: i,
        name: o.name,
        position: o.position,
        division: o.division,
        period: o.period,
        bio: o.bio,
        photoUrl: o.photoUrl,
        photoFit: o.photoFit,
        photoPosition: o.photoPosition,
        photoShape: o.photoShape,
      });
    }
    return args.officials;
  },
});

// === CONTACT ===
export const getContact = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("contact")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();
    if (!row) return null;
    return {
      address: row.address,
      phone: row.phone,
      whatsapp: row.whatsapp,
      email: row.email,
      hours: row.hours,
      socials: row.socials,
    };
  },
});

export const saveContact = mutation({
  args: {
    address: v.string(),
    phone: v.string(),
    whatsapp: v.string(),
    email: v.string(),
    hours: v.string(),
    socials: v.array(
      v.object({
        name: v.string(),
        handle: v.string(),
        href: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("contact")
      .withIndex("by_key", (q) => q.eq("key", "default"))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("contact", { key: "default", ...args });
    }
    return args;
  },
});
