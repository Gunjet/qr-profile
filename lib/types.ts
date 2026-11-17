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
