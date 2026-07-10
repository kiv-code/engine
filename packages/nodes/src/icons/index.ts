import type { IconifyJSON } from "@iconify/types";
import { getIconData, iconToHTML, iconToSVG } from "@iconify/utils";
import brandsData from "@iconify-json/fa6-brands/icons.json" with {
	type: "json",
};
import regularData from "@iconify-json/fa6-regular/icons.json" with {
	type: "json",
};
import solidData from "@iconify-json/fa6-solid/icons.json" with {
	type: "json",
};
import lucideData from "@iconify-json/lucide/icons.json" with { type: "json" };

export interface IconSet {
	prefix: string;
	label: string;
	data: IconifyJSON;
}

export interface ResolvedIcon {
	name: string;
	svg: string;
	set: IconSet;
}

const iconSets: IconSet[] = [
	{ prefix: "lucide", label: "Lucide", data: lucideData },
	{ prefix: "fa6-solid", label: "Solid", data: solidData },
	{ prefix: "fa6-regular", label: "Regular", data: regularData },
	{ prefix: "fa6-brands", label: "Brands", data: brandsData },
];

export function getIconSets(): IconSet[] {
	return iconSets;
}

function dataToSvg(data: IconifyJSON, iconName: string): string | null {
	const iconData = getIconData(data, iconName);
	if (!iconData) return null;
	const svg = iconToSVG(iconData, { height: "auto" });
	return iconToHTML(svg.body, svg.attributes);
}

function getIconSetByPrefix(prefix: string): IconSet | undefined {
	return iconSets.find((s) => s.prefix === prefix);
}

function findIconInSets(iconName: string): ResolvedIcon | null {
	for (const set of iconSets) {
		const svg = dataToSvg(set.data, iconName);
		if (svg) return { name: iconName, svg, set };
	}
	return null;
}

export function resolveIcon(value: string): string | null {
	const trimmed = value.trim();
	if (trimmed.startsWith("<svg")) return trimmed;

	const colonIdx = trimmed.indexOf(":");
	if (colonIdx > 0) {
		const prefix = trimmed.slice(0, colonIdx);
		const name = trimmed.slice(colonIdx + 1);
		const set = getIconSetByPrefix(prefix);
		if (set) return dataToSvg(set.data, name);
		const fallback = findIconInSets(name);
		return fallback?.svg ?? null;
	}

	const found = findIconInSets(trimmed);
	return found?.svg ?? null;
}

export function resolveIconInfo(value: string): ResolvedIcon | null {
	const trimmed = value.trim();
	if (trimmed.startsWith("<svg")) return null;

	const colonIdx = trimmed.indexOf(":");
	if (colonIdx > 0) {
		const prefix = trimmed.slice(0, colonIdx);
		const name = trimmed.slice(colonIdx + 1);
		const set = getIconSetByPrefix(prefix);
		if (set) {
			const svg = dataToSvg(set.data, name);
			return svg ? { name, svg, set } : null;
		}
	}

	const found = findIconInSets(trimmed);
	return found;
}
