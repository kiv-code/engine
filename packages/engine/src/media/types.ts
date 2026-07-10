export interface MediaAsset {
	id: string;
	url: string;
	type: "image" | "video" | "file";
	width?: number;
	height?: number;
	alt?: string;
	meta?: Record<string, unknown>;
}

export interface UploadOptions {
	folder?: string;
	filename?: string;
}

export interface ImageTransform {
	width?: number;
	height?: number;
	quality?: number;
	format?: "webp" | "avif" | "jpg" | "png";
}

export interface MediaListQuery {
	/** Filters by filename/URL substring. */
	search?: string;
	/** Filters by asset type. */
	type?: MediaAsset["type"];
}

/**
 * Implemented by the consumer app (S3, Cloudinary, local disk...) and injected via `createEngine({ media })`.
 *
 * `list` is optional: providers that only support direct upload/resolve (no
 * enumerable library) can omit it. The media browser falls back to an
 * upload-only view when it's missing.
 */
export interface MediaProvider {
	upload(file: File, opts?: UploadOptions): Promise<MediaAsset>;
	resolve(src: string, transforms?: ImageTransform): string;
	delete(url: string): Promise<void>;
	list?(query?: MediaListQuery): Promise<MediaAsset[]>;
}
