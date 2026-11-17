import type { Metadata } from "next";
import { AuthCard } from "../AuthCard";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Бүртгүүлэх — QR Профайл" };

export default function SignupPage() {
  return (
    <AuthCard title="Бүртгүүлэх" subtitle="Бүртгэл үүсгээд өөрийн QR профайлаа бэлдээрэй">
      <SignupForm />
    </AuthCard>
  );
}
