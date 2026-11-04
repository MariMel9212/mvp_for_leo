import { himkiCenter } from "@/content/centers/himki";
import { troitskCenter } from "@/content/centers/troitsk";
import type { CenterPageData } from "@/content/centers/types";

export const centers = {
  troitsk: troitskCenter,
  himki: himkiCenter,
} satisfies Record<string, CenterPageData>;

export type CenterSlug = keyof typeof centers;
