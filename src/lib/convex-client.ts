export interface ConvexFetchClient {
  query: (path: string, args?: object) => Promise<unknown>;
  mutation: (path: string, args?: object) => Promise<unknown>;
}

export function getConvexUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL?.trim().replace(/\/+$/, "");
  return url || null;
}

async function callConvexEndpoint(
  baseUrl: string,
  kind: "query" | "mutation",
  fnPath: string,
  args: object = {}
): Promise<unknown> {
  const res = await fetch(`${baseUrl}/api/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: fnPath,
      args,
      format: "json",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Convex ${kind} (${fnPath}) failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as {
    status?: string;
    value?: unknown;
    errorMessage?: string;
  };

  if (data.status === "error") {
    throw new Error(data.errorMessage || `Convex ${kind} error on ${fnPath}`);
  }

  return data.value;
}

export function getConvexClient(): ConvexFetchClient | null {
  const url = getConvexUrl();
  if (!url) return null;

  return {
    query: (fnPath, args = {}) =>
      callConvexEndpoint(url, "query", fnPath, args),
    mutation: (fnPath, args = {}) =>
      callConvexEndpoint(url, "mutation", fnPath, args),
  };
}

export const convexApi = {
  content: {
    generateUploadUrl: "content:generateUploadUrl",
    getStorageUrl: "content:getStorageUrl",
    listNews: "content:listNews",
    getNewsBySlug: "content:getNewsBySlug",
    addNews: "content:addNews",
    deleteNews: "content:deleteNews",
    listGallery: "content:listGallery",
    addGallery: "content:addGallery",
    deleteGallery: "content:deleteGallery",
    getProgramKerja: "content:getProgramKerja",
    saveProgramKerja: "content:saveProgramKerja",
    listOfficials: "content:listOfficials",
    saveOfficials: "content:saveOfficials",
    getContact: "content:getContact",
    saveContact: "content:saveContact",
    getProfile: "content:getProfile",
    saveProfile: "content:saveProfile",
  },
  members: {
    listMembers: "members:listMembers",
    getMemberByEmail: "members:getMemberByEmail",
    addMember: "members:addMember",
    updateMember: "members:updateMember",
    resetMemberPassword: "members:resetMemberPassword",
    deleteMember: "members:deleteMember",
  },
  admins: {
    countAdmins: "admins:countAdmins",
    getAdminByEmail: "admins:getAdminByEmail",
    listAdmins: "admins:listAdmins",
    createAdmin: "admins:createAdmin",
    updateAdminStatus: "admins:updateAdminStatus",
    deleteAdmin: "admins:deleteAdmin",
  },
  aspirations: {
    listAspirations: "aspirations:listAspirations",
    addAspiration: "aspirations:addAspiration",
    deleteAspiration: "aspirations:deleteAspiration",
  },
} as const;

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
