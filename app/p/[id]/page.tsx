import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerson } from "@/lib/store";
import { billingStatus } from "@/lib/billing";
import { Inactive } from "./Inactive";
import { ProfileView } from "./ProfileView";

export async function generateMetadata({ params }: PageProps<"/p/[id]">): Promise<Metadata> {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) return { title: "Олдсонгүй" };
  return {
    title: `${person.name} — ${person.position}`,
    description: person.organization || person.position,
  };
}

export default async function ProfilePage({ params }: PageProps<"/p/[id]">) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();
  if (!billingStatus(person.paidUntil, new Date()).visible) return <Inactive person={person} />;
  return <ProfileView person={person} />;
}
