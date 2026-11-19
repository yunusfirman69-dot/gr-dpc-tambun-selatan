import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  news: defineTable({
    slug: v.string(),
    title: v.string(),
    category: v.string(),
    publishedAt: v.string(),
    excerpt: v.string(),
    content: v.array(v.string()),
    author: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  }).index("by_slug", ["slug"]),

  gallery: defineTable({
    title: v.string(),
    category: v.string(),
    date: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  }),

  officials: defineTable({
    externalId: v.string(),
    order: v.number(),
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
  }).index("by_order", ["order"]),

  programKerja: defineTable({
    key: v.string(),
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
  }).index("by_key", ["key"]),

  contact: defineTable({
    key: v.string(),
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
  }).index("by_key", ["key"]),

  members: defineTable({
    fullName: v.string(),
    nik: v.string(),
    phone: v.string(),
    email: v.string(),
    village: v.string(),
    ktpStorageId: v.id("_storage"),
    createdAt: v.string(),
  }),

  organizationProfile: defineTable({
    key: v.string(),
    partyName: v.string(),
    unitName: v.string(),
    region: v.string(),
    tagline: v.string(),
    quote: v.string(),
    historySummary: v.string(),
    historyTimeline: v.array(
      v.object({
        period: v.string(),
        title: v.string(),
        description: v.string(),
      })
    ),
    visiUtama: v.string(),
    haluanGerakan: v.string(),
    agendaGerakanRakyat: v.array(v.string()),
    pancaDharma: v.array(v.string()),
    limaJalan: v.array(v.string()),
    misiPerjuangan: v.array(
      v.object({
        number: v.string(),
        title: v.string(),
        description: v.string(),
      })
    ),
    areas: v.array(v.string()),
  }).index("by_key", ["key"]),

  admins: defineTable({
    fullName: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    role: v.union(v.literal("super_admin"), v.literal("editor")),
    createdAt: v.string(),
  }).index("by_email", ["email"]),
});
