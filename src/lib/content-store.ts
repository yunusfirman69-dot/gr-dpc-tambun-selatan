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
}

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "content-store.json");

function getInitialData(): ContentStoreData {
  return {
    news: newsPlaceholder,
    gallery: galleryPlaceholder,
    programKerja: programKerjaResmi,
    officials: officialsPlaceholder,
    contact: organizationInfo.contact,
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
    };
  } catch {
    const initial = getInitialData();
    await writeStore(initial);
    return initial;
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
