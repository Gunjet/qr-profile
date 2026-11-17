import type { Metadata } from "next";
import { AuthCard } from "../AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Нэвтрэх — QR Профайл" };

export default function LoginPage() {
  return (
    <AuthCard title="Нэвтрэх" subtitle="Утасны дугаар, нууц үгээрээ нэвтэрнэ үү">
      <LoginForm />
    </AuthCard>
  );
}
