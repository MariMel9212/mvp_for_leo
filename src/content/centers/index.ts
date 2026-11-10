import { klyuchiCenter } from "@/content/centers/klyuchi";
import { obrazMysliCenter } from "@/content/centers/obraz-mysli";
import { profmedCenter } from "@/content/centers/profmed";
import { vyhodEstCenter } from "@/content/centers/vyhod-est";
import type { CenterPageData } from "@/content/centers/types";

export const centers = {
  klyuchi: klyuchiCenter,
  "obraz-mysli": obrazMysliCenter,
  "vyhod-est": vyhodEstCenter,
  profmed: profmedCenter,
} satisfies Record<string, CenterPageData>;

export type CenterSlug = keyof typeof centers;
