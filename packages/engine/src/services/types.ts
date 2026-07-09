export interface ApiClient {
	get<T>(url: string, params?: Record<string, unknown>): Promise<T>;
	post<T>(url: string, body?: unknown): Promise<T>;
	put<T>(url: string, body?: unknown): Promise<T>;
	delete<T>(url: string): Promise<T>;
}

export interface AuthUser {
	id: string;
	name?: string;
	email?: string;
	roles?: string[];
}

export interface AuthProvider {
	getUser(): AuthUser | null;
	isAuthenticated(): boolean;
	hasRole(role: string): boolean;
}

export interface RouterProvider {
	push(path: string): void;
	replace(path: string): void;
	currentPath(): string;
}

export interface StorageProvider {
	get<T>(key: string): T | null;
	set<T>(key: string, value: T): void;
	remove(key: string): void;
}

/** Injected by the consumer app via `createEngine({ services })`. Each service is optional — plugins must check before using. */
export interface ServicesContainer {
	api?: ApiClient;
	auth?: AuthProvider;
	router?: RouterProvider;
	storage?: StorageProvider;
}
