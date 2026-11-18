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

export interface StoredNewsPost extends NewsPost {
  imageUrl?: string;
}

export interface StoredGalleryItem extends GalleryItem {
  imageUrl?: string;
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
    // Di lingkungan serverless/read-only (seperti Cloudflare Workers),
    // kembalikan data bawaan tanpa mencoba menulis ke disk.
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

export async function getNewsPosts(): Promise<StoredNewsPost[]> {
  const store = await readStore();
  return store.news;
}

export async function getNewsBySlug(
  slug: string
): Promise<StoredNewsPost | undefined> {
  const store = await readStore();
  return store.news.find((item) => item.slug === slug);
}

export async function addNewsPost(
  post: Omit<StoredNewsPost, "slug"> & { slug?: string }
): Promise<StoredNewsPost> {
  const store = await readStore();
  const newPost: StoredNewsPost = {
    ...post,
    slug: post.slug || createSlug(post.title),
  };
  store.news = [newPost, ...store.news];
  await writeStore(store);
  return newPost;
}

export async function deleteNewsPost(slug: string): Promise<boolean> {
  const store = await readStore();
  const before = store.news.length;
  store.news = store.news.filter((item) => item.slug !== slug);
  if (store.news.length === before) return false;
  await writeStore(store);
  return true;
}

export async function getGalleryItems(): Promise<StoredGalleryItem[]> {
  const store = await readStore();
  return store.gallery;
}

export async function addGalleryItem(
  item: Omit<StoredGalleryItem, "id">
): Promise<StoredGalleryItem> {
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
  const store = await readStore();
  const before = store.gallery.length;
  store.gallery = store.gallery.filter((item) => item.id !== id);
  if (store.gallery.length === before) return false;
  await writeStore(store);
  return true;
}

export async function getProgramKerjaData(): Promise<StoredProgramKerja> {
  const store = await readStore();
  return store.programKerja;
}

export async function saveProgramKerjaData(
  programKerja: StoredProgramKerja
): Promise<StoredProgramKerja> {
  const store = await readStore();
  store.programKerja = programKerja;
  await writeStore(store);
  return store.programKerja;
}

export async function getOfficialsData(): Promise<StoredOfficialItem[]> {
  const store = await readStore();
  return store.officials;
}

export async function saveOfficialsData(
  officials: StoredOfficialItem[]
): Promise<StoredOfficialItem[]> {
  const store = await readStore();
  store.officials = officials;
  await writeStore(store);
  return store.officials;
}

export async function getContactData(): Promise<StoredContactInfo> {
  const store = await readStore();
  return store.contact;
}

export async function saveContactData(
  contact: StoredContactInfo
): Promise<StoredContactInfo> {
  const store = await readStore();
  store.contact = contact;
  await writeStore(store);
  return store.contact;
}

export async function getMembersData(): Promise<StoredMemberItem[]> {
  const store = await readStore();
  return store.members;
}

export async function addMemberData(
  member: Omit<StoredMemberItem, "id" | "createdAt">
): Promise<StoredMemberItem> {
  const store = await readStore();
  const created: StoredMemberItem = {
    ...member,
    id: `mbr-${Date.now()}`,
    createdAt: new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()),
  };
  store.members = [created, ...store.members];
  await writeStore(store);
  return created;
}

export async function deleteMemberData(id: string): Promise<boolean> {
  const store = await readStore();
  const before = store.members.length;
  store.members = store.members.filter((item) => item.id !== id);
  if (store.members.length === before) return false;
  await writeStore(store);
  return true;
}
