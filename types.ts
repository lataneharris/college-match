export type YesNoPref = "yes" | "no" | "no_preference";
export type SizePref = "small" | "medium" | "large" | "no_preference";
export type RegionPref = "Southeast" | "Northeast" | "Midwest" | "Southwest" | "West" | "no_preference";

export type FindInputs = {
  sat?: number;
  act?: number;
  gpa?: number;
  size: SizePref;
  region: RegionPref;
  state?: string; // 2-letter or full name; we'll normalize server-side
  d1Sports: YesNoPref;
  greekLife: YesNoPref;
  control: "public" | "private" | "no_preference";
};

export type CollegeCard = {
  id: number;
  name: string;
  city?: string;
  state?: string;
  undergradSize?: number | null;
  acceptanceRate?: number | null;
  satAvg?: number | null;
  actMid?: number | null;
  avgGpa?: number | null;
  tuitionIn?: number | null;
  tuitionOut?: number | null;
  website?: string | null;
  admissionsUrl?: string | null;
  financialAidUrl?: string | null;
  instagramUrl?: string | null;

  hasGreekLife?: boolean | null;
  hasD1Sports?: boolean | null;

  imageUrl?: string | null;

  notableAlumni?: string[] | null;
  funFact?: string | null;

  matchScore?: number; // 0..100
};
