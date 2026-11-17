import { getPerson } from "@/lib/store";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (m) => "\\" + m);

export async function GET(_req: Request, ctx: RouteContext<"/p/[id]/vcard">) {
  const { id } = await ctx.params;
  const p = await getPerson(id);
  if (!p) return new Response("Not found", { status: 404 });

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(p.name)}`,
    `N:${esc(p.name)};;;;`,
    p.organization && `ORG:${esc(p.organization)}`,
    p.position && `TITLE:${esc(p.position)}`,
    ...p.phones.map((ph) => `TEL;TYPE=CELL:${ph.replace(/\s/g, "")}`),
    p.email && `EMAIL:${esc(p.email)}`,
    p.address && `ADR:;;${esc(p.address)};;;;`,
    ...p.socials.map((s) => `URL:${s.url}`),
  ];

  const photo = p.photo.match(/^data:image\/(jpeg|png);base64,(.+)$/);
  if (photo) lines.push(`PHOTO;ENCODING=b;TYPE=${photo[1].toUpperCase()}:${photo[2]}`);
  lines.push("END:VCARD");

  const body = lines.filter(Boolean).join("\r\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="contact.vcf"; filename*=UTF-8''${encodeURIComponent(p.name)}.vcf`,
    },
  });
}
