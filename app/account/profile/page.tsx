import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/users";
import { getPersonByOwner } from "@/lib/store";
import { saveMyProfile } from "@/app/account-actions";
import { PersonForm } from "@/app/_components/PersonForm";
import { ChevronLeftIcon } from "@/lib/icons";

export default async function MyProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const person = await getPersonByOwner(user.id);

  return (
    <div>
      <Link href="/account" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ChevronLeftIcon className="size-4" />
        Буцах
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
        {person ? "Мэдээлэл засах" : "Профайл үүсгэх"}
      </h1>
      <div className="mt-6">
        <PersonForm
          person={person ?? undefined}
          action={saveMyProfile}
          submitLabel={person ? "Хадгалах" : "Хадгалаад үргэлжлүүлэх"}
        />
      </div>
    </div>
  );
}
