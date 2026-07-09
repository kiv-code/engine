import type { MediaAsset, MediaProvider, StorageProvider } from "@kiv/engine";

/**
 * Minimal StorageProvider backed by localStorage — a stand-in for a real
 * key/value service (Redis, browser storage, etc). Namespaced separately
 * from persistence.ts's own page storage key so the two never collide.
 */
const KV_PREFIX = "kiv:demo:kv:";

export const localStorageService: StorageProvider = {
	get<T>(key: string): T | null {
		try {
			const raw = localStorage.getItem(KV_PREFIX + key);
			return raw ? (JSON.parse(raw) as T) : null;
		} catch {
			return null;
		}
	},
	set<T>(key: string, value: T): void {
		try {
			localStorage.setItem(KV_PREFIX + key, JSON.stringify(value));
		} catch {
			// storage full / unavailable — in a real app, surface this to the user
		}
	},
	remove(key: string): void {
		try {
			localStorage.removeItem(KV_PREFIX + key);
		} catch {
			// ignore
		}
	},
};

/**
 * Mock MediaProvider — creates a local object URL instead of uploading
 * anywhere. Swap for a real provider (S3, Cloudinary...) in a real app.
 */
export const mockMediaProvider: MediaProvider = {
	async upload(file, opts): Promise<MediaAsset> {
		return {
			id: `${file.name}-${file.size}`,
			url: URL.createObjectURL(file),
			type: file.type.startsWith("video") ? "video" : "image",
			meta: { folder: opts?.folder },
		};
	},
	resolve(src): string {
		return src;
	},
	async delete(): Promise<void> {
		// mock — nothing to clean up
	},
};
