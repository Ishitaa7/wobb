import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

const profileLoadersByKey = new Map<
  string,
  () => Promise<ProfileDetailResponse>
>();

for (const [path, loader] of Object.entries(profileModules)) {
  const filename = path.split("/").pop()?.replace(/\.json$/, "") ?? "";
  profileLoadersByKey.set(filename.toLowerCase(), loader);
}

const profileCache = new Map<string, ProfileDetailResponse | null>();
const inflightRequests = new Map<
  string,
  Promise<ProfileDetailResponse | null>
>();

async function fetchProfile(
  cacheKey: string
): Promise<ProfileDetailResponse | null> {
  const loader = profileLoadersByKey.get(cacheKey);
  if (!loader) return null;

  const result = await loader();
  const data =
    (result as { default?: ProfileDetailResponse }).default ?? result;
  return data as ProfileDetailResponse;
}

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const cacheKey = username.toLowerCase();

  if (profileCache.has(cacheKey)) {
    return profileCache.get(cacheKey) ?? null;
  }

  const inflight = inflightRequests.get(cacheKey);
  if (inflight) return inflight;

  const request = fetchProfile(cacheKey)
    .then((data) => {
      profileCache.set(cacheKey, data);
      inflightRequests.delete(cacheKey);
      return data;
    })
    .catch((error) => {
      inflightRequests.delete(cacheKey);
      throw error;
    });

  inflightRequests.set(cacheKey, request);
  return request;
}

export function getCachedProfile(
  username: string
): ProfileDetailResponse | null | undefined {
  return profileCache.get(username.toLowerCase());
}
