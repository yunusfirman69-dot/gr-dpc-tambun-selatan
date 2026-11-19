import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

export function getConvexUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  return url || null;
}

export function getConvexClient(): ConvexHttpClient | null {
  const url = getConvexUrl();
  if (!url) return null;
  return new ConvexHttpClient(url);
}

export const convexApi = anyApi;

export async function uploadFileToConvexStorage(
  file: File
): Promise<{ storageId: string; url: string | null }> {
  const client = getConvexClient();
  if (!client) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL belum dikonfigurasi.");
  }

  const uploadUrl = (await client.mutation(
    convexApi.content.generateUploadUrl,
    {}
  )) as string;

  const bytes = await file.arrayBuffer();
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: bytes,
  });

  if (!uploadRes.ok) {
    throw new Error("Gagal mengunggah file ke Convex Storage.");
  }

  const { storageId } = (await uploadRes.json()) as { storageId: string };
  const url = (await client.query(convexApi.content.getStorageUrl, {
    storageId,
  })) as string | null;

  return { storageId, url };
}
