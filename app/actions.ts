"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createPerson, deletePerson, updatePerson, type PersonInput } from "@/lib/store";
import { SOCIAL_TYPES, type SocialType } from "@/lib/types";
import { themeOf } from "@/lib/themes";

// TODO: add admin authentication before going to production.
// Server actions are reachable by direct POST requests.

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const all = (fd: FormData, key: string) => fd.getAll(key).map((v) => String(v).trim());

function parse(fd: FormData): PersonInput {
  const periods = all(fd, "exp_period");
  const titles = all(fd, "exp_title");
  const experience = titles
    .map((title, i) => ({ period: periods[i] ?? "", title }))
    .filter((e) => e.title || e.period);

  const sTypes = all(fd, "social_type");
  const sLabels = all(fd, "social_label");
  const sUrls = all(fd, "social_url");
  const validTypes = new Set(SOCIAL_TYPES.map((s) => s.value));
  const socials = sUrls
    .map((url, i) => ({
      type: (validTypes.has(sTypes[i] as SocialType) ? sTypes[i] : "website") as SocialType,
      label: sLabels[i] ?? "",
      url,
    }))
    .filter((s) => s.url);

  const photo = str(fd, "photo");

  return {
    name: str(fd, "name"),
    position: str(fd, "position"),
    organization: str(fd, "organization"),
    photo: photo.startsWith("data:image/") ? photo : "",
    about: str(fd, "about"),
    experience,
    phones: all(fd, "phone").filter(Boolean),
    email: str(fd, "email"),
    address: str(fd, "address"),
    mapUrl: str(fd, "mapUrl"),
    socials,
    theme: themeOf(str(fd, "theme")),
  };
}

export async function savePerson(id: string | null, formData: FormData) {
  const input = parse(formData);
  if (!input.name) throw new Error("Нэр оруулна уу");

  let personId = id;
  if (id) {
    await updatePerson(id, input);
  } else {
    personId = (await createPerson(input)).id;
  }

  revalidatePath("/admin");
  revalidatePath(`/p/${personId}`);
  redirect(`/admin/${personId}${id ? "?saved=1" : "?created=1"}`);
}

export async function removePerson(id: string) {
  await deletePerson(id);
  revalidatePath("/admin");
  redirect("/admin");
}
