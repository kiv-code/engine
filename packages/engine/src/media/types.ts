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

/** Implemented by the consumer app (S3, Cloudinary, local disk...) and injected via `createEngine({ media })`. */
export interface MediaProvider {
	upload(file: File, opts?: UploadOptions): Promise<MediaAsset>;
	resolve(src: string, transforms?: ImageTransform): string;
	delete(url: string): Promise<void>;
}
