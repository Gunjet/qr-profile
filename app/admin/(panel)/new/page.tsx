import { Suspense } from "react";
import { PageSkeleton } from "@/app/_components/PageSkeleton";
import Link from "next/link";
import { savePerson } from "@/app/actions";
import { ChevronLeftIcon } from "@/lib/icons";
import { PersonForm } from "@/app/_components/PersonForm";
import { KindChooser, parseKind } from "@/app/_components/KindChooser";

export default function NewPersonPage(props: PageProps<"/admin/new">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <NewPersonPageContent {...props} />
    </Suspense>
  );
}

async function NewPersonPageContent({ searchParams }: PageProps<"/admin/new">) {
  const kind = parseKind((await searchParams).kind);

  return (
    <div>
      <Link
        href={kind ? "/admin/new" : "/admin"}
        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900"
      >
        <ChevronLeftIcon className="size-4" />
        Буцах
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
        {kind === "business" ? "Шинэ бизнес нэмэх" : kind ? "Шинэ хүн нэмэх" : "Шинэ профайл"}
      </h1>

      <div className="mt-6 max-w-3xl">
        {kind ? (
          <PersonForm kind={kind} action={savePerson.bind(null, null)} submitLabel="Хадгалаад QR код үүсгэх" />
        ) : (
          <KindChooser basePath="/admin/new" />
        )}
      </div>
    </div>
  );
}
