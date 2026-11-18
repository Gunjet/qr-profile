import { Suspense } from "react";
import { PageSkeleton } from "@/app/_components/PageSkeleton";
import { EyeIcon } from "@/lib/icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/users";
import { getPersonByOwner } from "@/lib/store";
import { ProfileView } from "@/app/p/[id]/ProfileView";

// Owner-only preview: renders the profile even before it is paid / live.
export default function PreviewPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PreviewPageContent />
    </Suspense>
  );
}

async function PreviewPageContent() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const person = await getPersonByOwner(user.id);
  if (!person) redirect("/account/profile");

  return (
    <div className="-mx-4 -my-8 sm:-mx-6">
      <div className="flex items-center justify-between gap-3 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 sm:px-6">
        <span className="inline-flex items-center gap-2">
          <EyeIcon className="size-4" />
          Урьдчилан харах — зочид ингэж харна
        </span>
        <Link href="/account" className="font-semibold underline-offset-2 hover:underline">
          Буцах
        </Link>
      </div>
      <ProfileView person={person} />
    </div>
  );
}
