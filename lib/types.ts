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

export type ProfileKind = "person" | "business";

export type MenuItem = {
  name: string;
  description: string;
  price: number | null; // ₮
  photo: string; // small data URL or empty
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export type Person = {
  id: string;
  kind: ProfileKind; // "person" = personal intro, "business" = restaurant / menu
  name: string;
  position: string;
  organization: string;
  photo: string; // data URL (resized on the client) or empty
  about: string;
  experience: Experience[];
  hours: string; // business opening hours, free text
  menu: MenuSection[]; // business only
  phones: string[];
  email: string;
  address: string;
  mapUrl: string;
  socials: Social[];
  theme: string;
  paidUntil: string | null; // subscription end (ISO); managed by billing, not the profile form
  ownerId: string | null; // self-service account that owns this profile; null = created by admin
  ownerPhone?: string | null; // joined for admin views
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

export type Payment = {
  id: string;
  personId: string;
  months: number;
  amount: number;
  paidUntil: string; // subscription end after this payment
  createdAt: string;
};

export type PaymentRequest = {
  id: string;
  personId: string;
  personName: string;
  ownerPhone: string | null;
  months: number;
  amount: number;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  createdAt: string;
};
