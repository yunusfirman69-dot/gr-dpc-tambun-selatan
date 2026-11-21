import fs from "fs/promises";
import path from "path";
import {
  galleryPlaceholder,
  newsPlaceholder,
  officialsPlaceholder,
  organizationInfo,
  programKerjaResmi,
  type GalleryItem,
  type ImplementationMatrixRow,
  type NewsPost,
  type OfficialItem,
  type ProgramField,
} from "@/data/placeholder";
import { convexApi, getConvexClient } from "@/lib/convex-client";

export interface StoredNewsPost extends NewsPost {
  imageUrl?: string;
  imageStorageId?: string;
}

export interface StoredGalleryItem extends GalleryItem {
  imageUrl?: string;
  imageStorageId?: string;
}

export interface StoredOfficialItem extends OfficialItem {
  photoUrl?: string;
  photoFit?: "cover" | "contain";
  photoPosition?: "top" | "center" | "bottom";
  photoShape?: "square" | "circle" | "portrait";
}

export interface StoredSocialLink {
  name: string;
  handle: string;
  href: string;
}

export interface StoredContactInfo {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  socials: StoredSocialLink[];
}

export interface StoredMemberItem {
  id: string;
  fullName: string;
  nik: string;
  phone: string;
  email: string;
  village: string;
  ktpFileName: string;
  passwordHash?: string;
  createdAt: string;
}

export interface StoredProgramKerja {
  intro: string;
  landasan: string;
  fields: ProgramField[];
  implementationMatrix: ImplementationMatrixRow[];
}

interface ContentStoreData {
  news: StoredNewsPost[];
  gallery: StoredGalleryItem[];
  programKerja: StoredProgramKerja;
  officials: StoredOfficialItem[];
  contact: StoredContactInfo;
  members: StoredMemberItem[];
}

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "content-store.json");

function getInitialData(): ContentStoreData {
  return {
    news: newsPlaceholder,
    gallery: galleryPlaceholder,
    programKerja: programKerjaResmi,
    officials: officialsPlaceholder,
    contact: organizationInfo.contact,
    members: [],
  };
}

async function readStore(): Promise<ContentStoreData> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ContentStoreData>;
    return {
      news: Array.isArray(parsed.news) ? parsed.news : newsPlaceholder,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : galleryPlaceholder,
      programKerja: parsed.programKerja ?? programKerjaResmi,
      officials: Array.isArray(parsed.officials)
        ? parsed.officials
        : officialsPlaceholder,
      contact: parsed.contact ?? organizationInfo.contact,
      members: Array.isArray(parsed.members) ? parsed.members : [],
    };
  } catch {
    return getInitialData();
  }
}

async function writeStore(data: ContentStoreData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function createSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  const suffix = Date.now().toString().slice(-4);
  return `${base || "berita"}-${suffix}`;
}

// === NEWS ===
export async function getNewsPosts(): Promise<StoredNewsPost[]> {
  const convex = getConvexClient();
  if (convex) {
    try {
      const rows = (await convex.query(
        convexApi.content.listNews,
        {}
      )) as StoredNewsPost[];
      return rows.length > 0 ? rows : newsPlaceholder;
    } catch {
      return newsPlaceholder;
    }
  }
  const store = await readStore();
  return store.news;
}

export async function getNewsBySlug(
  slug: string
): Promise<StoredNewsPost | undefined> {
  const convex = getConvexClient();
  if (convex) {
    try {
      const row = (await convex.query(convexApi.content.getNewsBySlug, {
        slug,
      })) as StoredNewsPost | null;
      if (row) return row;
      return newsPlaceholder.find((item) => item.slug === slug);
    } catch {
      return newsPlaceholder.find((item) => item.slug === slug);
    }
  }
  const store = await readStore();
  return store.news.find((item) => item.slug === slug);
}

export async function addNewsPost(
  post: Omit<StoredNewsPost, "slug"> & { slug?: string }
): Promise<StoredNewsPost> {
  const slug = post.slug || createSlug(post.title);
  const convex = getConvexClient();
  if (convex) {
    const created = (await convex.mutation(convexApi.content.addNews, {
      slug,
      title: post.title,
      category: post.category,
      publishedAt: post.publishedAt,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      imageUrl: post.imageUrl,
      imageStorageId: post.imageStorageId,
    })) as StoredNewsPost;
    return created;
  }

  const store = await readStore();
  const newPost: StoredNewsPost = { ...post, slug };
  store.news = [newPost, ...store.news];
  await writeStore(store);
  return newPost;
}

export async function deleteNewsPost(slug: string): Promise<boolean> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(convexApi.content.deleteNews, {
      slug,
    })) as boolean;
  }

  const store = await readStore();
  const before = store.news.length;
  store.news = store.news.filter((item) => item.slug !== slug);
  if (store.news.length === before) return false;
  await writeStore(store);
  return true;
}

// === GALLERY ===
export async function getGalleryItems(): Promise<StoredGalleryItem[]> {
  const convex = getConvexClient();
  if (convex) {
    try {
      const rows = (await convex.query(
        convexApi.content.listGallery,
        {}
      )) as StoredGalleryItem[];
      return rows.length > 0 ? rows : galleryPlaceholder;
    } catch {
      return galleryPlaceholder;
    }
  }
  const store = await readStore();
  return store.gallery;
}

export async function addGalleryItem(
  item: Omit<StoredGalleryItem, "id">
): Promise<StoredGalleryItem> {
  const convex = getConvexClient();
  if (convex) {
    const created = (await convex.mutation(convexApi.content.addGallery, {
      title: item.title,
      category: item.category,
      date: item.date,
      description: item.description,
      imageUrl: item.imageUrl,
      imageStorageId: item.imageStorageId,
    })) as StoredGalleryItem;
    return created;
  }

  const store = await readStore();
  const newItem: StoredGalleryItem = {
    ...item,
    id: `gal-${Date.now()}`,
  };
  store.gallery = [newItem, ...store.gallery];
  await writeStore(store);
  return newItem;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(convexApi.content.deleteGallery, {
      id,
    })) as boolean;
  }

  const store = await readStore();
  const before = store.gallery.length;
  store.gallery = store.gallery.filter((item) => item.id !== id);
  if (store.gallery.length === before) return false;
  await writeStore(store);
  return true;
}

// === PROGRAM KERJA ===
export async function getProgramKerjaData(): Promise<StoredProgramKerja> {
  const convex = getConvexClient();
  if (convex) {
    try {
      const row = (await convex.query(
        convexApi.content.getProgramKerja,
        {}
      )) as StoredProgramKerja | null;
      return row ?? programKerjaResmi;
    } catch {
      return programKerjaResmi;
    }
  }
  const store = await readStore();
  return store.programKerja;
}

export async function saveProgramKerjaData(
  programKerja: StoredProgramKerja
): Promise<StoredProgramKerja> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(
      convexApi.content.saveProgramKerja,
      programKerja
    )) as StoredProgramKerja;
  }

  const store = await readStore();
  store.programKerja = programKerja;
  await writeStore(store);
  return store.programKerja;
}

// === OFFICIALS ===
export async function getOfficialsData(): Promise<StoredOfficialItem[]> {
  const convex = getConvexClient();
  if (convex) {
    try {
      const rows = (await convex.query(
        convexApi.content.listOfficials,
        {}
      )) as StoredOfficialItem[];
      return rows.length > 0 ? rows : officialsPlaceholder;
    } catch {
      return officialsPlaceholder;
    }
  }
  const store = await readStore();
  return store.officials;
}

export async function saveOfficialsData(
  officials: StoredOfficialItem[]
): Promise<StoredOfficialItem[]> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(convexApi.content.saveOfficials, {
      officials,
    })) as StoredOfficialItem[];
  }

  const store = await readStore();
  store.officials = officials;
  await writeStore(store);
  return store.officials;
}

// === CONTACT ===
export async function getContactData(): Promise<StoredContactInfo> {
  const convex = getConvexClient();
  if (convex) {
    try {
      const row = (await convex.query(
        convexApi.content.getContact,
        {}
      )) as StoredContactInfo | null;
      return row ?? organizationInfo.contact;
    } catch {
      return organizationInfo.contact;
    }
  }
  const store = await readStore();
  return store.contact;
}

export async function saveContactData(
  contact: StoredContactInfo
): Promise<StoredContactInfo> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(
      convexApi.content.saveContact,
      contact
    )) as StoredContactInfo;
  }

  const store = await readStore();
  store.contact = contact;
  await writeStore(store);
  return store.contact;
}

// === MEMBERS ===
export async function getMembersData(): Promise<StoredMemberItem[]> {
  const convex = getConvexClient();
  if (convex) {
    try {
      return (await convex.query(
        convexApi.members.listMembers,
        {}
      )) as StoredMemberItem[];
    } catch {
      return [];
    }
  }
  const store = await readStore();
  return store.members;
}

export async function getMemberByEmail(
  email: string
): Promise<StoredMemberItem | null> {
  const normalized = email.toLowerCase().trim();
  const convex = getConvexClient();
  if (convex) {
    try {
      return (await convex.query(convexApi.members.getMemberByEmail, {
        email: normalized,
      })) as StoredMemberItem | null;
    } catch {
      return null;
    }
  }
  const store = await readStore();
  return (
    store.members.find((m) => m.email.toLowerCase().trim() === normalized) ||
    null
  );
}

export async function addMemberData(
  member: Omit<StoredMemberItem, "id" | "createdAt">
): Promise<StoredMemberItem> {
  const createdAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  const convex = getConvexClient();
  if (convex) {
    const id = (await convex.mutation(convexApi.members.addMember, {
      fullName: member.fullName,
      nik: member.nik,
      phone: member.phone,
      email: member.email.toLowerCase().trim(),
      village: member.village,
      ktpStorageId: member.ktpFileName,
      passwordHash: member.passwordHash,
      createdAt,
    })) as string;
    return { ...member, id, createdAt };
  }

  const store = await readStore();
  const created: StoredMemberItem = {
    ...member,
    email: member.email.toLowerCase().trim(),
    id: `mbr-${Date.now()}`,
    createdAt,
  };
  store.members = [created, ...store.members];
  await writeStore(store);
  return created;
}

export async function updateMemberData(
  id: string,
  updates: {
    fullName: string;
    nik: string;
    phone: string;
    email: string;
    village: string;
    ktpFileName?: string;
  }
): Promise<StoredMemberItem | null> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(convexApi.members.updateMember, {
      id,
      fullName: updates.fullName,
      nik: updates.nik,
      phone: updates.phone,
      email: updates.email.toLowerCase().trim(),
      village: updates.village,
      ktpStorageId: updates.ktpFileName,
    })) as StoredMemberItem | null;
  }

  const store = await readStore();
  const idx = store.members.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const current = store.members[idx];
  const updated: StoredMemberItem = {
    ...current,
    fullName: updates.fullName,
    nik: updates.nik,
    phone: updates.phone,
    email: updates.email.toLowerCase().trim(),
    village: updates.village,
    ktpFileName: updates.ktpFileName || current.ktpFileName,
  };
  store.members[idx] = updated;
  await writeStore(store);
  return updated;
}

export async function resetMemberPassword(
  id: string,
  passwordHash: string
): Promise<boolean> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(convexApi.members.resetMemberPassword, {
      id,
      passwordHash,
    })) as boolean;
  }

  const store = await readStore();
  const idx = store.members.findIndex((item) => item.id === id);
  if (idx === -1) return false;
  store.members[idx] = { ...store.members[idx], passwordHash };
  await writeStore(store);
  return true;
}

export async function deleteMemberData(id: string): Promise<boolean> {
  const convex = getConvexClient();
  if (convex) {
    return (await convex.mutation(convexApi.members.deleteMember, {
      id,
    })) as boolean;
  }

  const store = await readStore();
  const before = store.members.length;
  store.members = store.members.filter((item) => item.id !== id);
  if (store.members.length === before) return false;
  await writeStore(store);
  return true;
}
