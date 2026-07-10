import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import VideoNode from "./VideoNode.vue";

describe("VideoNode", () => {
	it("renders a youtube-nocookie iframe from provider+videoId", () => {
		const wrapper = mount(VideoNode, {
			props: { provider: "youtube", videoId: "abc123" },
		});
		const iframe = wrapper.find("iframe");
		expect(iframe.exists()).toBe(true);
		expect(iframe.attributes("src")).toContain(
			"youtube-nocookie.com/embed/abc123",
		);
	});

	it("renders a vimeo iframe from provider+videoId", () => {
		const wrapper = mount(VideoNode, {
			props: { provider: "vimeo", videoId: "999" },
		});
		expect(wrapper.find("iframe").attributes("src")).toContain(
			"player.vimeo.com/video/999",
		);
	});

	it("renders a loom iframe from provider+videoId", () => {
		const wrapper = mount(VideoNode, {
			props: { provider: "loom", videoId: "loom-1" },
		});
		expect(wrapper.find("iframe").attributes("src")).toContain(
			"loom.com/embed/loom-1",
		);
	});

	it("appends autoplay/loop/mute/controls query params for embed providers", () => {
		const wrapper = mount(VideoNode, {
			props: {
				provider: "youtube",
				videoId: "abc123",
				autoplay: true,
				loop: true,
				muted: true,
				controls: false,
			},
		});
		const src = wrapper.find("iframe").attributes("src") ?? "";
		expect(src).toContain("autoplay=1");
		expect(src).toContain("loop=1");
		expect(src).toContain("mute=1");
		expect(src).toContain("controls=0");
	});

	it("renders a real <video> tag with a <source> for provider=html5", () => {
		const wrapper = mount(VideoNode, {
			props: {
				provider: "html5",
				src: "https://example.com/movie.mp4",
				poster: "https://example.com/poster.jpg",
				autoplay: true,
				loop: true,
				muted: true,
			},
		});
		const video = wrapper.find("video");
		expect(video.exists()).toBe(true);
		expect(video.attributes("poster")).toBe("https://example.com/poster.jpg");
		expect(video.attributes("autoplay")).toBe("");
		expect(video.attributes("loop")).toBe("");
		expect(video.attributes("muted")).toBe("");
		expect(video.find("source").attributes("src")).toBe(
			"https://example.com/movie.mp4",
		);
	});

	it("renders the empty state for html5 with no src", () => {
		const wrapper = mount(VideoNode, { props: { provider: "html5" } });
		expect(wrapper.find("video").exists()).toBe(false);
		expect(wrapper.text()).toContain("No video source configured");
	});

	it("renders a figcaption below the video when caption is set", () => {
		const wrapper = mount(VideoNode, {
			props: { provider: "youtube", videoId: "abc123", caption: "A caption" },
		});
		expect(wrapper.find("figcaption").text()).toBe("A caption");
	});

	it("omits the figcaption when no caption is set", () => {
		const wrapper = mount(VideoNode, {
			props: { provider: "youtube", videoId: "abc123" },
		});
		expect(wrapper.find("figcaption").exists()).toBe(false);
	});

	it("maps aspectRatio to the container's padding-bottom", () => {
		const wrapper = mount(VideoNode, {
			props: { provider: "youtube", videoId: "x", aspectRatio: "4/3" },
		});
		expect(
			wrapper.find('[data-kiv-type="video"]').attributes("style"),
		).toContain("padding-bottom: 75%");
	});
});
