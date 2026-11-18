import { Suspense } from "react";
import { PageSkeleton } from "@/app/_components/PageSkeleton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/users";
import { getPersonByOwner } from "@/lib/store";
import { saveMyProfile } from "@/app/account-actions";
import { PersonForm } from "@/app/_components/PersonForm";
import { KindChooser, parseKind } from "@/app/_components/KindChooser";
import { ChevronLeftIcon } from "@/lib/icons";

export default function MyProfilePage(props: PageProps<"/account/profile">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MyProfilePageContent {...props} />
    </Suspense>
  );
}

async function MyProfilePageContent({ searchParams }: PageProps<"/account/profile">) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const person = await getPersonByOwner(user.id);
  const kind = person?.kind ?? parseKind((await searchParams).kind);

  return (
    <div>
      <Link
        href={person || !kind ? "/account" : "/account/profile"}
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        <ChevronLeftIcon className="size-4" />
        Буцах
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
        {person ? "Мэдээлэл засах" : kind ? "Профайл үүсгэх" : "Ямар профайл үүсгэх вэ?"}
      </h1>
      <div className="mt-6">
        {kind ? (
          <PersonForm
            person={person ?? undefined}
            kind={kind}
            action={saveMyProfile}
            submitLabel={person ? "Хадгалах" : "Хадгалаад үргэлжлүүлэх"}
          />
        ) : (
          <KindChooser basePath="/account/profile" />
        )}
      </div>
    </div>
  );
}
