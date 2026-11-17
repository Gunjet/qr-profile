export type SocialType = "facebook" | "instagram" | "youtube" | "x" | "website";

export type Experience = {
  period: string;
  title: string;
};

export type Social = {
  type: SocialType;
  label: string;
  url: string;
};

export type Person = {
  id: string;
  name: string;
  position: string;
  organization: string;
  photo: string; // data URL (resized on the client) or empty
  about: string;
  experience: Experience[];
  phones: string[];
  email: string;
  address: string;
  mapUrl: string;
  socials: Social[];
  theme: string;
  createdAt: string;
  updatedAt: string;
};

export const SOCIAL_TYPES: { value: SocialType; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X (Twitter)" },
  { value: "website", label: "Вэбсайт" },
];
