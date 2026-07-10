import { describe, expect, it } from "vitest";
import {
	applyMetaTagsToHead,
	buildSitemapEntry,
	generateMetaTags,
	generateStructuredData,
	metaTagsToHtml,
	resolveCanonicalUrl,
} from "./meta";

describe("resolveCanonicalUrl", () => {
	it("prefers an explicit canonicalUrl", () => {
		expect(
			resolveCanonicalUrl({ canonicalUrl: "https://x.com/y", slug: "/z" }),
		).toBe("https://x.com/y");
	});

	it("falls back to origin + slug", () => {
		expect(
			resolveCanonicalUrl({ slug: "pricing" }, { origin: "https://x.com/" }),
		).toBe("https://x.com/pricing");
	});

	it("returns undefined with no canonicalUrl, slug, or origin", () => {
		expect(resolveCanonicalUrl({})).toBeUndefined();
	});
});

describe("generateMetaTags", () => {
	it("includes title, description, and index/follow robots by default", () => {
		const tags = generateMetaTags({ title: "Home", description: "Welcome" });
		expect(tags).toContainEqual({ tag: "title", attrs: {}, content: "Home" });
		expect(tags).toContainEqual({
			tag: "meta",
			attrs: { name: "description", content: "Welcome" },
		});
		expect(tags).toContainEqual({
			tag: "meta",
			attrs: { name: "robots", content: "index, follow" },
		});
	});

	it("emits noindex/nofollow when set", () => {
		const tags = generateMetaTags({ noindex: true, nofollow: true });
		expect(tags).toContainEqual({
			tag: "meta",
			attrs: { name: "robots", content: "noindex, nofollow" },
		});
	});

	it("falls back OG title/description to title/description", () => {
		const tags = generateMetaTags({ title: "Home", description: "Welcome" });
		expect(tags).toContainEqual({
			tag: "meta",
			attrs: { property: "og:title", content: "Home" },
		});
		expect(tags).toContainEqual({
			tag: "meta",
			attrs: { property: "og:description", content: "Welcome" },
		});
	});

	it("includes a canonical link and og:url when resolvable", () => {
		const tags = generateMetaTags({ canonicalUrl: "https://x.com/y" });
		expect(tags).toContainEqual({
			tag: "link",
			attrs: { rel: "canonical", href: "https://x.com/y" },
		});
		expect(tags).toContainEqual({
			tag: "meta",
			attrs: { property: "og:url", content: "https://x.com/y" },
		});
	});

	it("uses summary_large_image twitter card when an og image is set", () => {
		const tags = generateMetaTags({ ogImage: "https://x.com/img.png" });
		expect(tags).toContainEqual({
			tag: "meta",
			attrs: { name: "twitter:card", content: "summary_large_image" },
		});
	});
});

describe("metaTagsToHtml", () => {
	it("renders title and self-closing tags, escaping content", () => {
		const html = metaTagsToHtml([
			{ tag: "title", attrs: {}, content: "A & B" },
			{ tag: "meta", attrs: { name: "description", content: "Welcome" } },
		]);
		expect(html).toContain("<title>A &amp; B</title>");
		expect(html).toContain('<meta name="description" content="Welcome" />');
	});
});

describe("generateStructuredData", () => {
	it("produces a schema.org WebPage object from title/description/canonical", () => {
		const data = generateStructuredData({
			title: "Home",
			description: "Welcome",
			canonicalUrl: "https://x.com/",
		});
		expect(data).toMatchObject({
			"@context": "https://schema.org",
			"@type": "WebPage",
			name: "Home",
			description: "Welcome",
			url: "https://x.com/",
		});
	});
});

describe("buildSitemapEntry", () => {
	it("returns null when there is no resolvable URL", () => {
		expect(buildSitemapEntry({})).toBeNull();
	});

	it("returns the URL and priority when resolvable", () => {
		expect(
			buildSitemapEntry({
				canonicalUrl: "https://x.com/",
				sitemapPriority: 0.8,
			}),
		).toEqual({
			url: "https://x.com/",
			priority: 0.8,
		});
	});
});

describe("applyMetaTagsToHead", () => {
	it("sets document.title and upserts meta/link elements without duplicating them", () => {
		document.head.innerHTML = "";
		const tags = generateMetaTags({
			title: "Home",
			description: "Welcome",
			canonicalUrl: "https://x.com/",
		});
		applyMetaTagsToHead(tags);
		applyMetaTagsToHead(tags);
		expect(document.title).toBe("Home");
		expect(
			document.head.querySelectorAll('meta[name="description"]'),
		).toHaveLength(1);
		expect(
			document.head
				.querySelector('link[rel="canonical"]')
				?.getAttribute("href"),
		).toBe("https://x.com/");
	});
});
