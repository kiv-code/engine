import { defineNode, f } from "@kiv/engine";
import { escapeHtml, styleToString } from "../html-utils";
import { RADIUS, SHADOW } from "../scales";

function embedUrl(
	provider: string | undefined,
	videoId: string | undefined,
): string {
	if (!videoId) return "";
	if (provider === "youtube") {
		return `https://www.youtube-nocookie.com/embed/${escapeHtml(videoId)}`;
	}
	if (provider === "vimeo") {
		return `https://player.vimeo.com/video/${escapeHtml(videoId)}`;
	}
	return "";
}

export const videoNode = defineNode({
	type: "video",
	category: "media",
	toHtml(props) {
		const provider = String(props.provider ?? "youtube");
		const videoId = String(props.videoId ?? "");
		const src =
			provider === "custom"
				? escapeHtml(props.src ?? "")
				: embedUrl(provider, videoId);

		const containerStyle = styleToString({
			position: "relative",
			width: "100%",
			paddingBottom: props.aspectRatio === "4/3" ? "75%" : "56.25%",
			height: "0",
			overflow: "hidden",
			borderRadius: RADIUS[String(props.borderRadius ?? "none")] ?? "0",
			boxShadow: SHADOW[String(props.shadow ?? "none")] ?? "none",
		});

		const iframeStyle = styleToString({
			position: "absolute",
			inset: "0",
			width: "100%",
			height: "100%",
			border: "0",
		});

		const params = new URLSearchParams();
		if (props.autoplay) params.set("autoplay", "1");
		if (props.loop) params.set("loop", "1");
		if (props.muted) params.set("mute", "1");
		if (!props.controls) params.set("controls", "0");
		const queryStr = params.toString();
		const finalSrc = queryStr ? `${src}?${queryStr}` : src;

		if (!finalSrc) {
			return `<div style="${containerStyle}" data-kiv-type="video"><p style="padding:1rem;text-align:center;color:#999;">No video source configured</p></div>`;
		}

		return `<div style="${containerStyle}" data-kiv-type="video"><iframe src="${escapeHtml(finalSrc)}" style="${iframeStyle}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
	},
	fields: {
		provider: f.select(["youtube", "vimeo", "custom"], {
			label: "Provider",
			default: "youtube",
			group: "Content",
		}),
		videoId: f.text({
			label: "Video ID",
			group: "Content",
			showIf: { field: "provider", equals: ["youtube", "vimeo"] },
		}),
		src: f.text({
			label: "Video URL",
			group: "Content",
			showIf: { field: "provider", equals: "custom" },
		}),
		aspectRatio: f.select(["16/9", "4/3"], {
			label: "Aspect ratio",
			default: "16/9",
			group: "Style",
		}),
		borderRadius: f.select(["none", "sm", "md", "lg", "xl", "full"], {
			label: "Border radius",
			default: "none",
			group: "Style",
		}),
		shadow: f.select(["none", "sm", "md", "lg"], {
			label: "Shadow",
			default: "none",
			group: "Style",
		}),
		autoplay: f.boolean({
			label: "Autoplay",
			default: false,
			group: "Playback",
		}),
		controls: f.boolean({
			label: "Show controls",
			default: true,
			group: "Playback",
		}),
		loop: f.boolean({ label: "Loop", default: false, group: "Playback" }),
		muted: f.boolean({ label: "Muted", default: false, group: "Playback" }),
	},
});
