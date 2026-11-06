import { himkiCenter } from "@/content/centers/himki";
import { klyuchiCenter } from "@/content/centers/klyuchi";
import { narkologCenter } from "@/content/centers/narkolog";
import { troitskCenter } from "@/content/centers/troitsk";
import type { CenterPageData } from "@/content/centers/types";

export const centers = {
  troitsk: troitskCenter,
  himki: himkiCenter,
  klyuchi: klyuchiCenter,
  narkolog: narkologCenter,
} satisfies Record<string, CenterPageData>;

export type CenterSlug = keyof typeof centers;
