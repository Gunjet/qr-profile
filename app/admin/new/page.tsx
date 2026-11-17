import Link from "next/link";
import { savePerson } from "@/app/actions";
import { ChevronLeftIcon } from "@/lib/icons";
import { PersonForm } from "../_components/PersonForm";

export default function NewPersonPage() {
  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900">
        <ChevronLeftIcon className="size-4" />
        Буцах
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">Шинэ хүн нэмэх</h1>

      <div className="mt-6 max-w-3xl">
        <PersonForm action={savePerson.bind(null, null)} submitLabel="Хадгалаад QR код үүсгэх" />
      </div>
    </div>
  );
}
