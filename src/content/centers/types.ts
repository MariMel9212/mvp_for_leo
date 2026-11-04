import type { AmenityIconName } from "@/components/amenity-icons";

export type CenterFact = {
  label: string;
  value: string;
  extra?: string;
  extraHint?: string;
};

export type CenterPhoto = {
  src: string;
  alt: string;
  frameClassName: string;
  imageClassName?: string;
};

export type CenterAmenity = {
  icon: AmenityIconName;
  label: string;
};

export type CenterScheduleItem = {
  time: string;
  event: string;
};

export type CenterPerson = {
  name: string;
  role: string;
  photo: string;
};

export type CenterStaffCount = {
  count: string;
  role: string;
};

export type CenterPageData = {
  title: string;
  region: string;
  facts: CenterFact[];
  about: { lead: string; rest: string };
  amenities: CenterAmenity[];
  schedule: CenterScheduleItem[];
  staff:
    | { kind: "people"; people: CenterPerson[]; summary: string }
    | { kind: "counts"; counts: CenterStaffCount[] };
  features: string[];
  gallery: {
    main: CenterPhoto;
    topMiddle: CenterPhoto;
    topRight: CenterPhoto;
    bottomMiddle: CenterPhoto;
    more: CenterPhoto;
    moreLabel?: string;
    photos: { src: string; alt: string }[];
  };
};
